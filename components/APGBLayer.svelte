<script>
  import APGB_key from "../data/APGB_key.json";

  import { onMount, getContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  let APGBLayer = "Hide";
  const APGBKEY = APGB_key["APGB_KEY"]
  console.log(APGBKEY)

  onMount(async () => {
    if (map.getSource("25cm")) {
    } else {
      map.addSource("25cm", {
        type: "raster",
        tiles: [
          `https://ogc.apps.midgard.airbusds-cint.com/apgb/wmts/rest/apgb:AP-25CM-GB-LATEST/default/EPSG-3857/EPSG:3857:{z}/{y}/{x}?GUID=${APGBKEY}&format=image/png&TRANSPARENT=FALSE`,
        ],
        minZoom: 0,
        maxZoom: 22,
      });
    }
    if (map.getSource("12.5cm")) {
    } else {
      map.addSource("12.5cm", {
        type: "raster",
        tiles: [
          `https://ogc.apps.midgard.airbusds-cint.com/apgb/wmts/rest/apgb:AP-12CM5-GB-LATEST/default/EPSG-3857/EPSG:3857:{z}/{y}/{x}?GUID=${APGBKEY}&format=image/png&TRANSPARENT=FALSE`,
        ],
        minZoom: 0,
        maxZoom: 22,
      });
    }
  });

  function setLayer() {
    if (APGBLayer == "Hide") {
      if (map.getLayer("25cm")) {
        map.removeLayer("25cm");
      }
      if (map.getLayer("12.5cm")) {
        map.removeLayer("12.5cm");
      }
    } else {
      if (map.getLayer(APGBLayer.split(" ")[0])) {
        map.removeLayer(APGBLayer.split(" ")[0]);
      }
      if (APGBLayer.split(" ").length == 1) {
        map.addLayer({
          id: APGBLayer,
          type: "raster",
          source: APGBLayer.split(" ")[0],
          paint: {},
        });
      } else {
        map.addLayer(
          {
            id: APGBLayer.split(" ")[0],
            type: "raster",
            source: APGBLayer.split(" ")[0],
            paint: {},
          },
          "aeroway_fill"
        );
      }
    }
  }

  function listAPGBLayers() {
    let APGBLayers = [
      "Hide",
      "25cm",
      "25cm with roads",
      // "12.5cm",
      // "12.5cm with roads",
    ];
    return APGBLayers;
  }
</script>

<div class="govuk-form-group" style="display: flex;">
  <label
    class="govuk-label"
    for="scoreLayer"
    style="margin-right: 10px; margin-top: 5px; font-size: 1.2rem;"
  >
    Aerial photo:
  </label>
  <select
    class="govuk-select"
    id="scoreLayer"
    name="scoreLayer"
    bind:value={APGBLayer}
    on:change={setLayer}
  >
    {#each listAPGBLayers() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<style>
  /* div {
    z-index: 1;
    position: absolute;
    top: 497px;
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
