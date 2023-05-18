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
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Business_nipy_spectral.pmtiles",
    });
    map.addSource("Entertainment", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Entertainment_nipy_spectral.pmtiles",
    });
    map.addSource("Education", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Education_nipy_spectral.pmtiles",
    });
    map.addSource("Shopping", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Shopping_nipy_spectral.pmtiles",
    });
    map.addSource("Residential", {
      type: "raster",
      url: "pmtiles://" + PMTILES_BUCKET_URL + "ew_Residential_nipy_spectral.pmtiles",
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
    style="margin-right: 10px; margin-top: 5px; font-size: 1.2rem;"
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
    top: 5px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  }

  select {
    font-size: 1.1rem;
    padding: 4px 8px;
  }
</style>
