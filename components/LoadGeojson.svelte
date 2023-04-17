<script>
  import { onMount, getContext } from "svelte";
  import { callApi } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  const source = "squareInfoGeoJson";
  const layer = "squareInfoLayer";
  export let squareInfoGeoJson;
  export let squareID;


  function emptyGeojson() {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }
  function resetMap() {
    squareInfoGeoJson = null;
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    if (map.getLayer("polygon")) {
      map.removeLayer("polygon");
    }
    for (let i = 0; i < 3; i++) {
      const layerId = `education_${i}`;
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    }
  }
  function resetID() {
    squareID = null;
  }

  function resetMapAndID() {
    resetID();
    resetMap();
  }

  onMount(() => {
    map.addSource(source, { type: "geojson", data: emptyGeojson() });
  });

  map.on("click", async function (e) {
    let req = e.lngLat;
    let resp = await callApi(req);
    if (resp !== "click_not_on_square") {
      squareInfoGeoJson = resp;
      squareID = squareInfoGeoJson['name']
    }
  });

  map.on("contextmenu", function () {
    resetMapAndID();
  });

  $: {
    if (squareInfoGeoJson && map.getSource(source)) {
      map.getSource(source).setData(squareInfoGeoJson);
      setLayer();
    }
  }

  function setLayer() {
    resetMap();

    map.addLayer({
      id: "polygon",
      source: source,
      type: "line",
      paint: {
        "line-color": "#000000",
        "line-width": 5,
      },
      filter: ["==", "$type", "Polygon"],
    });

    for (let i = 0; i < 3; i++) {
      const layerId = `education_${i}`;
      map.addLayer({
        id: layerId,
        source: source,
        type: "circle",
        paint: {
          "circle-color": i === 0 ? "#FF8C00" : i === 1 ? "#438759" : "#570861",
          "circle-radius": i === 0 ? 40 : i === 1 ? 32 : 21,
          "circle-opacity": 0.8,
          "circle-stroke-color": "#000000",
          "circle-stroke-width": 3,
        },
        filter: ["all", ["==", "$type", "Point"], ["==", "name", layerId]],
      });
    }
    map.moveLayer("polygon");
    map.moveLayer("education_0");
    map.moveLayer("education_1");
    map.moveLayer("education_2");
  }
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
