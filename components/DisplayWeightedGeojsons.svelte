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
  export let tileOpacity;
  let geoJson = null;

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
    if (squareScores && squaresFound && map.getSource(source)) {
      console.log("running");
      geoJson = createSquareGeojson();
      map.getSource(source).setData(geoJson);
      setLayer();
    }
  }
  $: {
    // if opacity changes just set layer again
    if (tileOpacity) {
      setLayer();
    }
  }

  let reloadGeoJson = false;
  let clickedOnSlider = false;

  // Event listeners for if click used to reload tiles when click off sliders
  // Add event listener for mouse down
  document.addEventListener("mousedown", (e) => {
    let clickedElement = e.target;
    if (clickedElement.tagName !== "DIV") {
      return;
    }
    // checks if the click is on slider
    if (clickedElement.getAttribute("class") === "thumb svelte-1q9yxz9") {
      clickedOnSlider = true;
    }
    reloadGeoJson = false;
  });

  // Add event listener for mouse up
  document.addEventListener("mouseup", (e) => {
    if (clickedOnSlider) {
      reloadGeoJson = true;
      clickedOnSlider = false;
    }
  });

  $: {
    if (geoJson !== null) {
      if (reloadGeoJson) {
        geoJson = updateWeightingInGeoJson(geoJson);
        map.getSource(source).setData(geoJson);
        setLayer();
      }
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
      scores.push(weightedOverall);
      weightedScores.push(scores);
    });
    return weightedScores;
  }

  function createSquareGeojson() {
    // TODO: Add check so doesn't rerun on on already calculated scores
    // find square coords in LL format and custom weighted scores
    let squareLLCoordinates = createLLCoords(squareScores, mode);
    let weightedScores = findWeightedScore(squareScores, mode, weights);
    let geojson = emptyGeojson();
    console.log(squareScores);

    // assert they are of equal length
    if (squareLLCoordinates.length == weightedScores.length) {
      // if so then create geojson of scores
      for (let i = 0; i < squareLLCoordinates.length; i++) {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [squareLLCoordinates[i]],
          },
          properties: {
            mode: mode,
            scores: weightedScores[i].slice(0, 6),
            weightedScore: weightedScores[i][6],
          },
        });
      }
    } else {
      console.log("Uneven lengths of coordinates and weighted scores");
    }
    console.log(geojson);
    return geojson;
  }
  function updateWeightingInGeoJson(geoJson) {
    console.time("updateWeights");
    let combinedWeight = 0;
    let weightsArray = [];
    for (let key in weights) {
      if (weights.hasOwnProperty(key)) {
        combinedWeight += weights[key];
        weightsArray.push(weights[key]);
      }
    }
    console.timeEnd("updateWeights");
    console.time("updateWeighting");
    geoJson.features.forEach((feature) => {
      // const scores = feature.properties.scores;
      let weightedOverall = 0;
      for (let i = 0; i < 6; i++) {
        weightedOverall += Math.round(
          feature.properties.scores[i] * (weightsArray[i] / combinedWeight)
        );
      }
      feature.properties.weightedScore = weightedOverall;
    });
    console.timeEnd("updateWeighting");
    return geoJson;
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
          "fill-color": [
            "to-color",
            ["at", ["get", "weightedScore"], ["literal", hexlookup]],
          ],
          "fill-outline-color": "rgba(0, 0, 0, 0.2)",
          "fill-opacity": tileOpacity / 100,
        },
      });
      console.log("set layer");
    }
  }
  let hexlookup = [
    "#000000",
    "#130015",
    "#2f0035",
    "#41004b",
    "#5d006b",
    "#700080",
    "#7a008b",
    "#7d008e",
    "#810092",
    "#850096",
    "#870098",
    "#6d009c",
    "#58009f",
    "#3800a3",
    "#2300a6",
    "#0300aa",
    "#0000b1",
    "#0000bd",
    "#0000c9",
    "#0000d1",
    "#0000dd",
    "#0013dd",
    "#002fdd",
    "#0041dd",
    "#005ddd",
    "#0078dd",
    "#007ddd",
    "#0085dd",
    "#008add",
    "#0092dd",
    "#0098dd",
    "#009cd3",
    "#009fcb",
    "#00a3bf",
    "#00a7b3",
    "#00aaab",
    "#00aaa3",
    "#00aa9d",
    "#00aa95",
    "#00aa90",
    "#00aa88",
    "#00a773",
    "#00a353",
    "#009f33",
    "#009d1d",
    "#009a00",
    "#009f00",
    "#00a700",
    "#00ac00",
    "#00b400",
    "#00bc00",
    "#00c200",
    "#00ca00",
    "#00cf00",
    "#00d700",
    "#00dc00",
    "#00e400",
    "#00ea00",
    "#00f200",
    "#00fa00",
    "#00ff00",
    "#2cff00",
    "#49ff00",
    "#75ff00",
    "#93ff00",
    "#bcff00",
    "#c4fc00",
    "#d0f800",
    "#dcf400",
    "#e4f100",
    "#efed00",
    "#f1e700",
    "#f5df00",
    "#f8da00",
    "#fcd200",
    "#ffc900",
    "#ffc100",
    "#ffb500",
    "#ffad00",
    "#ffa100",
    "#ff9900",
    "#ff7500",
    "#ff5d00",
    "#ff3900",
    "#ff1500",
    "#fe0000",
    "#f60000",
    "#f10000",
    "#e90000",
    "#e40000",
    "#dc0000",
    "#da0000",
    "#d60000",
    "#d20000",
    "#cf0000",
    "#cc0c0c",
    "#cc2c2c",
    "#cc5c5c",
    "#cc7c7c",
    "#ccacac",
    "#cccccc",
  ];
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
