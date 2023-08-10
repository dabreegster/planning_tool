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
    map.addSource("Business by PT", {
      type: "raster",
      url:
        "pmtiles://" + PMTILES_BUCKET_URL + "ew_Business_nipy_spectral.pmtiles",
    });
    map.addSource("Entertainment by PT", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Entertainment_nipy_spectral.pmtiles",
    });
    map.addSource("Education by PT", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Education_nipy_spectral.pmtiles",
    });
    map.addSource("Shopping by PT", {
      type: "raster",
      url:
        "pmtiles://" + PMTILES_BUCKET_URL + "ew_Shopping_nipy_spectral.pmtiles",
    });
    map.addSource("Residential by PT", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Residential_nipy_spectral.pmtiles",
    });

    map.addSource("Business by driving", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Business_car_nipy_spectral.pmtiles",
    });
    map.addSource("Entertainment by driving", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Entertainment_car_nipy_spectral.pmtiles",
    });
    map.addSource("Education by driving", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Education_car_nipy_spectral.pmtiles",
    });
    map.addSource("Shopping by driving", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Shopping_car_nipy_spectral.pmtiles",
    });
    map.addSource("Residential by driving", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Residential_car_nipy_spectral.pmtiles",
    });
    map.addSource("Health by driving", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Health_car_nipy_spectral.pmtiles",
    });

    map.addSource("Business by walking", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Business_walk_nipy_spectral.pmtiles",
    });
    map.addSource("Entertainment by walking", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Entertainment_walk_nipy_spectral.pmtiles",
    });
    map.addSource("Education by walking", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Education_walk_nipy_spectral.pmtiles",
    });
    map.addSource("Shopping by walking", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Shopping_walk_nipy_spectral.pmtiles",
    });
    map.addSource("Residential by walking", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Residential_walk_nipy_spectral.pmtiles",
    });

    map.addSource("Health by walking", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Health_walk_nipy_spectral.pmtiles",
    });

    map.addSource("Business by cycling", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Business_cycling_nipy_spectral.pmtiles",
    });
    map.addSource("Entertainment by cycling", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Entertainment_cycling_nipy_spectral.pmtiles",
    });
    map.addSource("Education by cycling", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Education_cycling_nipy_spectral.pmtiles",
    });
    map.addSource("Shopping by cycling", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Shopping_cycling_nipy_spectral.pmtiles",
    });
    map.addSource("Residential by cycling", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Residential_cycling_nipy_spectral.pmtiles",
    });
    map.addSource("Health by cycling", {
      type: "raster",
      url:
        "pmtiles://" +
        PMTILES_BUCKET_URL +
        "ew_Health_cycling_nipy_spectral.pmtiles",
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

      "Business by PT",
      "Education by PT",
      "Shopping by PT",
      "Residential by PT",
      "Entertainment by PT",

      "Business by walking",
      "Education by walking",
      "Shopping by walking",
      "Residential by walking",
      "Entertainment by walking",
      "Health by walking",

      "Business by driving",
      "Education by driving",
      "Shopping by driving",
      "Residential by driving",
      "Entertainment by driving",
      "Health by driving",

      "Business by cycling",
      "Education by cycling",
      "Shopping by cycling",
      "Residential by cycling",
      "Entertainment by cycling",
      "Health by cycling",
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
  /* div {
    z-index: 1;
    position: absolute;
    top: 260px;
    right: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  } */

  select {
    font-size: 1.1rem;
    padding: 4px 8px;
  }
</style>
