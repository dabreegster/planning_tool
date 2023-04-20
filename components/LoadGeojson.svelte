<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import { getSquareInfo, callFloodfillApi } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  const source = "squareInfoGeoJson";
  const pointLayer = "floodPoints";
  const lineLayer = "floodLines";

  export let squareID;

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
    map.addLayer({
      source,
      id: pointLayer,
      filter: ["==", "$type", "Point"],
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
        "line-width": 5.0,
        "line-opacity": 1.0,
      },
    });
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

    addStuffToMap(resp);
  });

  function addStuffToMap(resp) {
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
    for (let [linkID, link] of Object.entries(resp[0].link_coordinates)) {
      gj.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [link.start_node_longlat, link.end_node_longlat],
        },
        properties: {},
      });
    }

    map.getSource(source).setData(gj);
  }

  map.on("contextmenu", function () {
    resetMapAndID();
  });
</script>

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
</style>
