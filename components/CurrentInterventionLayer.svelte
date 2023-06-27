<script>
  import { onMount, getContext } from "svelte";
  import { emptyGeojson } from "../stores.js";
  import proj4 from "proj4";

  const { getMap } = getContext("map");
  const map = getMap();

  const source = "intervention";
  const layer = "intervention_layer";

  // configuration for lat/long -> OSGB easting northing conversion
  var osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs";
  var wgs84 = "+proj=longlat +ellps=WGS84 +towgs84=0,0,0 +no_defs";

  export let hoveredInterventionScores;
  export let responseJson;

  let scoreLayer = "Hide";

  onMount(() => {
    map.addSource(source, { type: "geojson", data: emptyGeojson() });
  });

  $: {
    if (responseJson && map.getSource(source)) {
      loadInterventionScores().then((geojsonData) => {
        map.getSource(source).setData(geojsonData);
        setLayer();
      });
    }
  }

  map.on("mousemove", layer, function (e) {
    if (e.features.length > 0) {
      hoveredInterventionScores = e.features[0].properties;
    }
  });
  map.on("mouseleave", layer, function () {
    hoveredInterventionScores = null;
  });

  function findThresholds(responseJson) {
    let results_table = null;
    results_table = responseJson.tile_diff_scores;
    let maxValue = 0;
    for (const key in results_table) {
      // TODO: change backend to rename return square_ID instead of lsoa_name
      if (key == "lsoa_name") {
      } else {
        const values = Object.values(results_table[key]);
        for (const value of values) {
          if (value > maxValue) {
            maxValue = value;
          }
        }
      }
    }
    let thresholds = [];
    for (let i = 0; i <= 9; i++) {
      thresholds.push(i * 0.1 * maxValue);
    }
    return thresholds;
  }

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    if (scoreLayer !== "Hide") {
      let opacity = [0.1, 0.18, 0.26, 0.33, 0.41, 0.49, 0.57, 0.64, 0.72, 0.8];
      let thresholds = findThresholds(responseJson);
      map.addLayer({
        id: layer,
        source: source,
        type: "fill",
        paint: {
          "fill-color": "#0062ff",
          "fill-outline-color": "rgba(0, 0, 0, 0.2)",
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["get", scoreLayer],
            thresholds[0],
            0,
            0.000001,
            opacity[0],
            thresholds[1],
            opacity[1],
            thresholds[2],
            opacity[2],
            thresholds[3],
            opacity[3],
            thresholds[4],
            opacity[4],
            thresholds[5],
            opacity[5],
            thresholds[6],
            opacity[6],
            thresholds[7],
            opacity[7],
            thresholds[8],
            opacity[8],
            thresholds[9],
            opacity[9],
          ],
        },
      });
    }
  }

  function scoreTypes() {
    let purposes = [
      "Hide",
      "Business",
      "Education",
      "Entertainment",
      "Health",
      "Shopping",
      "Residential",
    ];
    return purposes;
  }

  // Returns geojson updated with intervention scores
  // and only the polygons which are affected
  async function loadInterventionScores() {
    // geojson.features = geojson.features.concat(geojson2.features);

    let n = Object.keys(responseJson.tile_diff_scores.lsoa_name).length;
    let squareCentroids = responseJson.tile_diff_scores.lsoa_name;

    // let features_from_intervention = [];
    // let indexes_affected = [];

    // convert square easting northing centroids into the 4 LongLat coordinates of surrounding square
    let squareENCoordinates = [];
    for (var i = 0; i < n; i++) {
      let squareCentroid = squareCentroids[i];
      let [centroidEasting, centroidNorthing] = squareCentroid
        .split("_")
        .map(Number);
      squareENCoordinates.push([
        [centroidEasting - 50, centroidNorthing - 50],
        [centroidEasting + 50, centroidNorthing - 50],
        [centroidEasting + 50, centroidNorthing + 50],
        [centroidEasting - 50, centroidNorthing + 50],
      ]);
    }

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

    // create geoJson of results squares
    let geojson = emptyGeojson();
    // add scores
    for (var i = 0; i < n; i++) {
      let feature = { geometry: { type: "Polygon" } };
      let new_properties = {};
      new_properties["Business"] = parseFloat(
        responseJson.tile_diff_scores["Business"][i].toFixed(10)
      );
      new_properties["Education"] = parseFloat(
        responseJson.tile_diff_scores["Education"][i].toFixed(10)
      );
      new_properties["Entertainment"] = parseFloat(
        responseJson.tile_diff_scores["Entertain / public activity"][i].toFixed(
          10
        )
      );
      new_properties["Health"] = parseFloat(
        responseJson.tile_diff_scores["Health"][i].toFixed(10)
      );
      new_properties["Shopping"] = parseFloat(
        responseJson.tile_diff_scores["Shopping"][i].toFixed(10)
      );
      new_properties["Residential"] = parseFloat(
        responseJson.tile_diff_scores["Visit friends at private home"][
          i
        ].toFixed(10)
      );
      feature.geometry["coordinates"] = [squareLLCoordinates[i]];
      feature["properties"] = new_properties;
      geojson.features.push(feature);
    }
    return geojson;
  }
</script>

<div class="govuk-form-group" style="display: flex; ">
  <label
    class="govuk-label"
    for="scoreLayer"
    style="margin-right: 10px; margin-top: 8px; font-size: 1rem; opacity: {responseJson ==
    null
      ? 0.15
      : 1}"
  >
    Intervention scores:
  </label>
  <select
    class="govuk-select"
    id="scoreLayer"
    name="scoreLayer"
    style="opacity: {responseJson == null ? 0.15 : 1}"
    bind:value={scoreLayer}
    on:change={setLayer}
    disabled={responseJson == null}
  >
    {#each scoreTypes() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<style>
  div {
    z-index: 1;
    position: absolute;
    bottom: 44px;
    right: 65px;
    background: white;
    padding: 5px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  }

  select {
    font-size: 16px;
    padding: 4px 8px;
  }
</style>
