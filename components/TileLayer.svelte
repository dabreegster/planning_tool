<script>
  import { onMount, getContext, setContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  export let tileOpacity = 70;
  // TODO Revert, this is nicer for development
  let scoreLayer = "Hide";

  let PMTILES_BUCKET_URL =
    "https://storage.googleapis.com/very-nice-tiles-bucket/";
  const layer = "tiles";

  onMount(async () => {
    map.addSource("Business", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Business.pmtiles",
    });
    map.addSource("Entertainment", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Entertainment.pmtiles",
    });
    map.addSource("Education", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Education.pmtiles",
    });
    map.addSource("Shopping", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Shopping.pmtiles",
    });
    map.addSource("Residential", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Residential.pmtiles",
    });
    setLayer();
  });

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    if (scoreLayer != "Hide") {
      map.addLayer({
        id: layer,
        type: "raster",
        source: scoreLayer,
        paint: {
          "raster-opacity": tileOpacity / 100,
        },
      });
    }
  }

  // let PMTILES_URL =
  //   "https://storage.googleapis.com/very-nice-tiles-bucket/blackpool_scores.pmtiles";
  // const source = "blackpool_scores_source";
  // const layer = "blackpool_scores";

  // onMount(async () => {
  //   map.addSource("blackpool_scores_source", {
  //     type: "vector",
  //     url: "pmtiles://" + PMTILES_URL,
  //   });
  //   // setLayer();
  // });

  // function setLayer() {
  //   if (map.getLayer(layer)) {
  //     map.removeLayer(layer);
  //   }
  //   if (scoreLayer != "Hide") {
  //     map.addLayer({
  //       id: layer,
  //       source: source,
  //       "source-layer": "blackpool_scores",
  //       type: "fill",
  //       paint: {
  //         "fill-color": [
  //           "interpolate",
  //           ["linear"],
  //           ["get", scoreLayer],
  //           10,
  //           "#67001f",
  //           20,
  //           "#b2182b",
  //           30,
  //           "#d6604d",
  //           40,
  //           "#f4a582",
  //           50,
  //           "#fddbc7",
  //           60,
  //           "#d1e5f0",
  //           70,
  //           "#92c5de",
  //           80,
  //           "#4393c3",
  //           90,
  //           "#2166ac",
  //           100,
  //           "#053061",
  //         ],
  //         // "fill-outline-color": "rgba(0, 0, 0, 0.2)",
  //         "fill-opacity": tileOpacity / 100,
  //       },
  //     });
  //   }
  // }
  $: setLayer();

  $: {
    setContext("tileOpacity", tileOpacity);
    setLayer();
  }

  function scoreTypes() {
    let purposes = [
      "Hide",
      "Business",
      "Education",
      "Shopping",
      "Residential",
      "Entertainment",
      // "Overall"
    ];
    return purposes;
  }
</script>

<div class="govuk-form-group" style="display: flex;">
  <label
    class="govuk-label"
    for="scoreLayer"
    style="margin-right: 10px; margin-top: 2px; font-size: 1.5rem;"
  >
    Tile layer score purpose:
  </label>
  <select
    class="govuk-select"
    id="scoreLayer"
    name="scoreLayer"
    bind:value={scoreLayer}
    on:change={setLayer}
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
    top: 95px;
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
