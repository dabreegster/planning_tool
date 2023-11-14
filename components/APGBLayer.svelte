<script>
  import APGB_key from "../data/APGB_key.json";

  import { onMount, getContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  let APGBLayer;
  const APGBKEY = APGB_key["APGB_KEY"];

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

      // // select which layer to put it below
      // let beforeID = null;
      // if (map.getLayer("base-line.cold")) {
      //   beforeID = "base-line.cold";
      // }
      // if (map.getLayer("tiles")) {
      //   beforeID = "tiles";
      // }
      // // if statement to check if spaces in name (a bit primative)
      // if (APGBLayer.split(" ").length == 1) {
      //   map.addLayer(
      //     {
      //       id: APGBLayer,
      //       type: "raster",
      //       source: APGBLayer.split(" ")[0],
      //       paint: {},
      //     },
      //     beforeID
      //   );
      // } else {
      map.addLayer(
        {
          id: APGBLayer.split(" ")[0],
          type: "raster",
          source: APGBLayer.split(" ")[0],
          paint: {},
        },
        "aeroway_fill"
      );
      // }
    }
  }

  function listAPGBLayers() {
    let APGBLayers = [
      "Hide",
      "25cm",
      // "25cm with roads",
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
    style="margin-right: 10px; margin-top: 5px; font-size: 0.9rem;"
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
  select {
    padding: 4px 8px;
    font-size: 0.9rem;
    height: 30px;
    float: right;
    border: 1px solid rgb(0, 0, 0);
    width: 68%;
  }
</style>
