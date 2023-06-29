<script>
  import { onMount, onDestroy, getContext } from "svelte";

  const { getMap } = getContext("map");

  const map = getMap();

  import proj4 from "proj4";
  // configuration for lat/long -> OSGB easting northing conversion
  var osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs";
  var wgs84 = "+proj=longlat +ellps=WGS84 +towgs84=0,0,0 +no_defs";

  const source = "weightedSquares";
  const layer = "weightedSquaresLayer";

  // let hoverInfo = "no_selection";
  let weightedScoreLayer = "Show"; // TODO: change this
  export let weights;
  export let squareScores;
  export let mode;
  export let squaresFound;

  function emptyGeojson() {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  onMount(() => {
    map.addSource(source, { type: "geojson", data: emptyGeojson() });
  });
  onDestroy(() => {
    if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }

    if (map.getSource(source)) {
      map.removeSource(source);
    }
  });

  $: {
    if (weights && squareScores && squaresFound && map.getSource(source)) {
      console.log("running")
      createSquareGeojson().then((gjData) => {
        map.getSource(source).setData(gjData);
        // setLayer();
      });
    }
  }

  function createLLCoords(squareScores, mode) {
    // create longlat coordinates from the squareID
    let squareENCoordinates = [];
    Object.entries(squareScores[mode]).forEach(([squareCentroid, scores]) => {
      let [centroidEasting, centroidNorthing] = squareCentroid
        .split("_")
        .map(Number);
      squareENCoordinates.push([
        [centroidEasting - 50, centroidNorthing - 50],
        [centroidEasting + 50, centroidNorthing - 50],
        [centroidEasting + 50, centroidNorthing + 50],
        [centroidEasting - 50, centroidNorthing + 50],
      ]);
    });
    // flatten array
    let flatSquareENCoordinates = squareENCoordinates.flat();
    // convert to LongLat
    let flatSquareLLCoordinates = flatSquareENCoordinates.map((coords) =>
      proj4(osgb, wgs84, coords)
    );
    // renest list into 4
    let squareLLCoordinates = [];
    for (var i = 0; i < flatSquareLLCoordinates.length; i += 4) {
      let LLCoordinates = flatSquareLLCoordinates.slice(i, i + 4);
      squareLLCoordinates.push(LLCoordinates);
    }
    return squareLLCoordinates;
  }

  function findWeightedScore(squareScores, mode, weights) {
    // find custom weighted overall score
    // calculate total of weights to use as divider
    // TODO: update this to be total of 1
    let combinedWeight = 0;
    let weightsArray = [];
    for (let key in weights) {
      if (weights.hasOwnProperty(key)) {
        combinedWeight += weights[key];
        weightsArray.push(weights[key]);
      }
    }
    // create array each weighted score for each square
    let weightedScores = [];
    Object.entries(squareScores[mode]).forEach(([squareID, scores]) => {
      let weightedOverall = 0;
      // loop over each purpose and apply weighting
      for (let i = 0; i < 6; i++) {
        weightedOverall += Math.round(
          scores[i] * (weightsArray[i] / combinedWeight)
        );
      }
      weightedScores.push(weightedOverall);
    });
    return weightedScores;
  }

  async function createSquareGeojson() {
    // TODO: Add check so doesn't rerun on on already calculated scores
    // find square coords in LL format and custom weighted scores
    let squareLLCoordinates = createLLCoords(squareScores, mode);
    let weightedScores = findWeightedScore(squareScores, mode, weights);
    let geojson = emptyGeojson();

    // assert they are of equal length
    if (squareLLCoordinates.length == weightedScores.length) {
      // if so then create geojson of scores
      for (let i = 0; i < squareLLCoordinates.length; i++) {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: squareLLCoordinates[i],
          },
          properties: {
            mode: mode,
            weightedScore: weightedScores[i],
          },
        });
      }
    } else {
      console.log("Uneven lengths of coordinates and weighted scores");
    }
    console.log(geojson);
    return geojson;
  }

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    if (weightedScoreLayer !== "Hide") {
      map.addLayer({
        id: layer,
        source: source,
        type: "fill",
        paint: {
          "fill-color": "#0062ff",
          "fill-outline-color": "rgba(0, 0, 0, 0.2)",
        },
      });
      console.log("set layer");
    }
  }


</script>

<!-- 
<div class="purposeBox" style="display: flex;">
  <label
    class="govuk-label"
    for="purpose"
    style="margin-right: 10px; margin-top: 5px; font-size: 1.2rem;"
  >
    Displayed route purpose:
  </label>
  <select
    class="govuk-select"
    id="purpose"
    name="purpose"
    bind:value={purpose}
    on:change={setLayers}
  >
    {#each purposes as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<button class="govuk-label" style="font-size: 1.2rem;" on:click={resetMapAndID}
  >Clear polygons (right click)
</button>

<div class="startTimeSelection">
  <label for="start-time-input">Start Time:</label>
  <input
    id="start-time-input"
    type="time"
    name="start-time-input"
    value="08:00"
    min="06:00"
    max="22:00"
    style="font-size: 15px; padding:5px"
    on:change={(e) => updateStartTime(e)}
  />
  <span class="validity" />
</div>

<style>
  button {
    display: false;
    /* z-index: 1;
    position: absolute;
    top: 160px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2); */
  }

  .purposeBox {
    z-index: 1;
    position: absolute;
    top: 327px;
    right: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  }

  select {
    font-size: 1.1rem;
    padding: 4px 8px;
  }
  .startTimeSelection {
    z-index: 1;
    position: absolute;
    top: 392px;
    right: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    font-size: 1.2rem;
  }

  input + span {
    padding-right: 30px;
  }

  input:invalid + span::after {
    position: absolute;
    content: "✖";
    padding-left: 5px;
  }

  input:valid + span::after {
    position: absolute;
    content: "✓";
    padding-left: 5px;
  }
</style> -->
