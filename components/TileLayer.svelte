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

  let modes = ["PT", "walking", "cycling", "driving"];

  let purposes = [
    "Business",
    "Education",
    "Health",
    "Entertainment",
    "Shopping",
    "Residential",
  ];

  function addSource(purpose, mode) {
    let source = purpose + " by " + mode;
    let tileModeString;
    if (map.getSource(source)) {
    } else {
      console.log();
      if (mode === "PT") {
        tileModeString = "";
      } else if (mode === "walking") {
        tileModeString = "_walk";
      } else if (mode === "cycling") {
        tileModeString = "_cycling";
      } else {
        tileModeString = "_car";
      }
      map.addSource(source, {
        type: "raster",
        url:
          "pmtiles://" +
          PMTILES_BUCKET_URL +
          "ew_" +
          purpose +
          tileModeString +
          "_nipy_spectral.pmtiles",
      });
    }
  }

  onMount(async () => {
    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i];
      for (let i = 0; i < purposes.length; i++) {
        const purpose = purposes[i];
        addSource(purpose, mode);
      }
    }
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
      "Entertainment by PT",
      "Shopping by PT",
      "Residential by PT",

      "Business by walking",
      "Education by walking",
      "Entertainment by walking",
      "Health by walking",
      "Shopping by walking",
      "Residential by walking",

      "Business by driving",
      "Education by driving",
      "Entertainment by driving",
      "Health by driving",
      "Shopping by driving",
      "Residential by driving",

      "Business by cycling",
      "Education by cycling",
      "Entertainment by cycling",
      "Health by cycling",
      "Shopping by cycling",
      "Residential by cycling",
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
