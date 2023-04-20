<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import { getSquareInfo, callFloodfillApi } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  const source = "squareInfoGeoJson";
  const pointLayer = "floodPoints";
  const lineLayer = "floodLines";

  export let squareID;
  let maxPerPurpose;
  let purpose = "business";

  function emptyGeojson() {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  function resetMapAndID() {
    squareID = null;
    map.getSource(source).setData(squareInfoGeoJson);
  }

  onMount(() => {
    map.addSource(source, { type: "geojson", data: emptyGeojson() });
  });
  onDestroy(() => {
    for (let layer of [pointLayer, lineLayer]) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    }

    if (map.getSource(source)) {
      map.removeSource(source);
    }
  });

  map.on("click", async function (e) {
    console.log(`Lookup square for ${e.lngLat}`);
    let info = await getSquareInfo(e.lngLat);
    if (info == "click_not_on_square") {
      return;
    }
    console.log(`Got square info ${JSON.stringify(info)}`);
    squareID = info.name;

    // Now make the floodfill request
    let req = {
      ...info,
      // TODO Set through UI
      trip_start_seconds: 30000,
    };
    let resp = await callFloodfillApi(req);

    dataChanged(resp);
  });

  function dataChanged(resp) {
    let gj = emptyGeojson();
    window.x = resp;

    // Circles for destinations
    for (let [
      purpose,
      top3,
    ] of resp[0].key_destinations_per_purpose.entries()) {
      for (let pt of top3) {
        gj.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: pt,
          },
          properties: {
            purpose,
          },
        });
      }
    }

    // Lines for links
    maxPerPurpose = [0.0, 0.0, 0.0, 0.0, 0.0];
    for (let [linkID, link] of Object.entries(resp[0].link_coordinates)) {
      let scorePerPurpose = resp[0].per_link_score_per_purpose[linkID];
      for (let [i, score] of scorePerPurpose.entries()) {
        maxPerPurpose[i] = Math.max(maxPerPurpose[i], score);
      }

      gj.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [link.start_node_longlat, link.end_node_longlat],
        },
        properties: {
          business: scorePerPurpose[0],
          education: scorePerPurpose[1],
          entertainment: scorePerPurpose[2],
          shopping: scorePerPurpose[3],
          visit_friends: scorePerPurpose[4],
        },
      });
    }
    console.log(
      `Max link scores per purpose: ${JSON.stringify(maxPerPurpose)}`
    );

    map.getSource(source).setData(gj);

    setLayers();
  }

  function setLayers() {
    let purposeIdx = purposes.indexOf(purpose);

    // Reset layers here. We can't configure them once, because the score scaling is dynamic
    for (let layer of [pointLayer, lineLayer]) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    }
    map.addLayer({
      source,
      id: pointLayer,
      filter: ["all", ["==", "$type", "Point"], ["==", "purpose", purposeIdx]],
      type: "circle",
      paint: {
        "circle-radius": 5.0,
        "circle-color": "black",
        "circle-opacity": 1.0,
      },
    });
    map.addLayer({
      source,
      id: lineLayer,
      filter: ["==", "$type", "LineString"],
      type: "line",
      paint: {
        "line-color": "black",
        // sqrt(x) / sqrt(max) * 10
        "line-width": [
          "*",
          10,
          [
            "/",
            ["sqrt", ["get", purpose]],
            Math.sqrt(maxPerPurpose[purposeIdx]),
          ],
        ],
        "line-opacity": 1.0,
      },
    });
  }

  map.on("contextmenu", function () {
    resetMapAndID();
  });

  let purposes = [
    "business",
    "education",
    "entertainment",
    "shopping",
    "visit_friends",
  ];
</script>

<div class="govuk-form-group" style="display: flex;">
  <label
    class="govuk-label"
    for="purpose"
    style="margin-right: 10px; margin-top: 2px; font-size: 1.5rem;"
  >
    Purpose:
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

<button class="govuk-label" style="font-size: 1.5rem;" on:click={resetMapAndID}
  >Clear polygons (right click)
</button>

<style>
  button {
    z-index: 1;
    position: absolute;
    top: 160px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  }

  div {
    z-index: 1;
    position: absolute;
    top: 275px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  }

  select {
    font-size: 1.3rem;
    padding: 4px 8px;
  }
</style>
