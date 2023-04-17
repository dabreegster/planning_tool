<script>
  import { onMount, getContext, setContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  export let tileOpacity;
  let scoreLayer = "Hide";

  let PMTILES_URL =
    "https://storage.googleapis.com/very-nice-tiles-bucket/blackpool_test.pmtiles";
  const source = "blackpool_test";
  const layer = "blackpool_test_grid";

  onMount(async () => {
    map.addSource("blackpool_test", {
      type: "vector",
      url: "pmtiles://" + PMTILES_URL,
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
        source: source,
        "source-layer": "blackpool_test",
        type: "fill",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", scoreLayer],
            10,
            "#67001f",
            20,
            "#b2182b",
            30,
            "#d6604d",
            40,
            "#f4a582",
            50,
            "#fddbc7",
            60,
            "#d1e5f0",
            70,
            "#92c5de",
            80,
            "#4393c3",
            90,
            "#2166ac",
            100,
            "#053061",
          ],
          // "fill-outline-color": "rgba(0, 0, 0, 0.2)",
          "fill-opacity": tileOpacity/100,
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
      "Business",
      "Education",
      "Shopping",
      "Residential",
      "Entertainment",
    ];
    let modes = ["Driving", "Walking", "Cycling", "PT"];
    let all = ["Hide", "Overall"];

    for (let mode of modes) {
      all.push(`Overall ${mode}`);
    }

    for (let purpose of purposes) {
      all.push(`Overall ${purpose}`);
      for (let mode of modes) {
        all.push(`${purpose} by ${mode}`);
      }
    }
    return all;
  }
</script>

<div class="govuk-form-group" style="display: flex;">
  <label
    class="govuk-label"
    for="scoreLayer"
    style="margin-right: 10px; margin-top: 2px; font-size: 1.5rem;"
  >
    Scores:
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
