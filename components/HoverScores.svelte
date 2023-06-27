<script>
  import proj4 from "proj4";
  import { getContext } from "svelte";
  import { getHoverScores } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  // configuration for lat/long -> OSGB easting northing conversion
  var osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs";
  var wgs84 = "+proj=longlat +ellps=WGS84 +towgs84=0,0,0 +no_defs";

  export let squareScores = {
    "Public Transport": {},
    "Walking": {},
    "Driving": {},
    "Cycling": {},
  };

  let purposes = [
    "Business",
    "Education",
    "Health",
    "Entertainment",
    "Shopping",
    "Residential",
    "Weighted Overall",
  ];

  let longitude = null;
  let latitude = null;
  let easting = null;
  let northing = null;
  let squareID = null;
  let freeForRequest = true;
  let lastRequestTime = 0;
  let zoom = map.getZoom();
  let mode = "Public Transport";
  export let weights;

  if (freeForRequest) {
    map.on("mousemove", async function (e) {
      freeForRequest = false;
      let currentTime = Date.now();
      let timeSinceLastRequest = currentTime - lastRequestTime;

      longitude = e.lngLat.lng;
      latitude = e.lngLat.lat;

      // convert latitude/longitude to easting/northing
      let eastingNorthing = proj4(wgs84, osgb, [longitude, latitude]);
      // round down to nearest 100 and add 50 for centroid of
      easting = Math.floor(eastingNorthing[0] / 100) * 100 + 50;
      northing = Math.floor(eastingNorthing[1] / 100) * 100 + 50;

      squareID = easting.toString() + "_" + northing.toString();

      if (squareID in squareScores[mode]) {
        // Request already made for this squareID, do nothing
      } else {
        // TODO: optimise the request limit
        if (timeSinceLastRequest >= 2000 && zoom >= 12) {
          lastRequestTime = currentTime;
          let response = await getHoverScores(squareID, mode);
          if (response == "not_in_square") {
          } else {
            let combinedWeight = 0;
            let weightsArray = [];
            for (let key in weights) {
              if (weights.hasOwnProperty(key)) {
                combinedWeight += weights[key];
                weightsArray.push(weights[key]);
              }
            }
            Object.entries(response).forEach(([key, scores]) => {
              let weightedOverall = 0;
              for (let i = 0; i < 6; i++) {
                weightedOverall += Math.round(scores[i] * (weightsArray[i]/ combinedWeight))
              };
              if (scores.length > 6) {
                scores[6] = weightedOverall
                response[key] = scores
              } else {
                scores.push(weightedOverall)
                response[key] = scores
              }
            });
            squareScores[mode] = { ...squareScores[mode], ...response };
            console.log(squareScores)
          }
        }
      }
      freeForRequest = true;
    });
  }

  // on zoom record the current zoom level
  map.on("zoom", () => {
    zoom = map.getZoom();
  });

  function setZoom12() {
    map.jumpTo({
      zoom: 12,
    });
  }
  function modeTypes() {
    let modes = [
    "Public Transport",
    "Driving",
    "Walking",
    "Cycling",
    ];
    return modes;
  }

  // function updateWithNewWeights() {
  //   let combinedWeight = 0;
  //   let weightsArray = [];
  //   for (let key in weights) {
  //     if (weights.hasOwnProperty(key)) {
  //       combinedWeight += weights[key];
  //       weightsArray.push(weights[key]);
  //     }
  //   }
  //   console.log(combinedWeight)
  //   console.log(weightsArray)
  //   // Object.entries(response).forEach(([key, scores]) => {
  //   //   let weightedOverall = 0;
  //   //   for (let i = 0; i < 6; i++) {
  //   //     weightedOverall += Math.round(scores[i] * (weightsArray[i]/ combinedWeight))
  //   //   };
  //   //   if (scores.length > 6) {
  //   //     scores[6] = weightedOverall
  //   //     response[key] = scores
  //   //   } else {
  //   //     scores.push(weightedOverall)
  //   //     response[key] = scores
  //   //   }
  //   // });
  //   // console.log(response)
  //   // squareScores[mode] = { ...squareScores[mode], ...response };
  // }


  // $: {updateWithNewWeights}
</script>

<div class="whitebox">
  <div class="govuk-form-group" style="display: flex;">
    <label
      class="govuk-label"
      for="modeLayer"
      style="margin-right: 10px; margin-top: 5px; font-size: 1.2rem;"
    >
      Mode:
    </label>
    <select
      class="govuk-select"
      bind:value={mode}
      on:change={mode}
    >
      {#each modeTypes() as x}
        <option value={x}>{x}</option>
      {/each}
    </select>
  </div>

  {#if zoom >= 12}
    {#if squareID in squareScores[mode]}
      <table class="govuk-table">
        <caption class="govuk-table__caption govuk-table__caption--s"
          >Score</caption
        >
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <!-- <th scope="col" class="govuk-table__header">Mode</th> -->
            <th scope="col" class="govuk-table__header">Purpose</th>
            <th scope="col" class="govuk-table__header">Score</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          {#each Array(purposes.length) as _, i}
            <tr class="govuk-table__row">
              <!-- <td class="govuk-table__cell">PT </td> -->
              <td class="govuk-table__cell">{purposes[i]}</td>
              <td class="govuk-table__cell">{squareScores[mode][squareID][i]}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p class="govuk-body">Hover over area to see scores</p>
    {/if}
  {:else}
    <p class="govuk-body">Zoom: {zoom.toFixed(2)}</p>
    <p class="govuk-body">To explore scores, zoom must be above 12</p>
  {/if}
</div>

<style>
  .whitebox {
    background-color: white;
    position: absolute;
    padding: 16px;
    border-radius: 10px;
    right: 10px;
    top: 500px;
    width: 300px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    font-size: 1.2rem;
  }
</style>
