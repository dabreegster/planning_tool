<script>
  import busUrl1 from "../data/stops_for_app_bus_coach1.geojson?url";
  import busUrl2 from "../data/stops_for_app_bus_coach2.geojson?url";
  import railUrl from "../data/stops_for_app_national_rail.geojson?url";
  import tubeUrl from "../data/stops_for_app_tube_lightrail_metro.geojson?url";
  import tramUrl from "../data/stops_for_app_tram.geojson?url";
  import ferryUrl from "../data/stops_for_app_ferry.geojson?url";
  import { onMount, getContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  // TODO: review hacky fix to having 2 busUrls
  let combinedBusData = null;
  const urls = [busUrl1, railUrl, tubeUrl, tramUrl, ferryUrl];
  const sources = [
    "bus_stops",
    "rail_stops",
    "tube_stops",
    "tram_stops",
    "ferry_stops",
  ];
  const layers = [
    "bus_layer",
    "rail_layer",
    "tube_layer",
    "tram_layer",
    "ferry_layer",
  ];
  const colors = ["purple", "red", "blue", "green", "orange"];
  let show = [false, false, false, false, false];
  let switchStatus = [true, true, true, true, true];

  onMount(async () => {
    // TODO: here aswell
    try {
      const [busData1, busData2] = await Promise.all([
        fetch(busUrl1).then((response) => response.json()),
        fetch(busUrl2).then((response) => response.json()),
      ]);
      
      combinedBusData = {
        type: "FeatureCollection",
        features: [...busData1.features, ...busData2.features],
      };

      for (let i = 0; i < 5; i++) {
        map.addSource(sources[i], {
          type: "geojson",
          data: i === 0 ? combinedBusData : urls[i],
        });

        map.addLayer({
          id: layers[i],
          source: sources[i],
          type: "circle",
          paint: {
            "circle-radius": 5,
            "circle-color": colors[i],
            "circle-opacity": 0.5,
          },
        });
      }

      toggleAll();
    } catch (error) {
      console.error("Error loading GeoJSON data:", error);
    }
  });

  function toggle(index, draw) {
    map.setLayoutProperty(
      layers[index],
      "visibility",
      show[index] ? "visible" : "none"
    );
    if (draw) {
      // TODO add ...&& switchStatus[index]
      switchStatus[index] = switchStatus[index];
    } else if (switchStatus[index] == show[index]) {
    } else {
      switchStatus[index] = !switchStatus[index];
    }
  }

  function toggleAll() {
    for (let i = 0; i < 5; i++) {
      toggle(i);
    }
  }
  export let stopLayerToggle;

  function toggleOnDraw(stopLayerToggle) {
    toggleOffDrawing();

    if (stopLayerToggle == "bus" && switchStatus[0] == false) {
      show[0] = !show[0];
      toggle(0, true);
    } else if (stopLayerToggle == "rail" && switchStatus[1] == false) {
      show[1] = !show[1];
      toggle(1, true);
    } else if (stopLayerToggle == "ferry" && switchStatus[4] == false) {
      show[4] = !show[4];
      toggle(4, true);
    } else {
      console.log("Error in toggleOnDraw function");
    }
  }

  function toggleOffDrawing() {
    for (let i = 0; i < show.length; i++) {
      if (show[i] && !switchStatus[i]) {
        show[i] = !show[i];
        toggle(i, true);
      }
    }
  }
</script>

{#if stopLayerToggle == "bus" || stopLayerToggle == "rail" || stopLayerToggle == "ferry"}
  {toggleOnDraw(stopLayerToggle)}
{/if}

{#if stopLayerToggle == "toggle_drawing_off"}
  {toggleOffDrawing()}
{/if}

<div class="govuk-label govuk-text--s" style="font-size: 1rem;">
  Bus/Coach stops:<input
    type="checkbox"
    bind:checked={show[0]}
    on:change={() => toggle(0, false)}
  />
  National Rail stops:<input
    type="checkbox"
    bind:checked={show[1]}
    on:change={() => toggle(1, false)}
  />
  Tube/Metro/LightRail stops:<input
    type="checkbox"
    bind:checked={show[2]}
    on:change={() => toggle(2, false)}
  />
  Tram stops:<input
    type="checkbox"
    bind:checked={show[3]}
    on:change={() => toggle(3, false)}
  />
  Ferry stops:<input
    type="checkbox"
    bind:checked={show[4]}
    on:change={() => toggle(4, false)}
  />
</div>

<style>
  div {
    z-index: 1;
    position: absolute;
    bottom: 30px;
    right: 65px;
    background: white;
    padding: 7px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  }
</style>
