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

  export let stopStatuses = {
    show: [false, false, false, false, false],
    switchStatus: [true, true, true, true, true],
  };
  export let stopCheckboxClicked = [true, 0];

  // event listener for when the checkboxes are clicked
  $: {
    toggle(stopCheckboxClicked[1], false);
  }

  onMount(async () => {
    // TODO: here aswell as bit hacky
    const [busData1, busData2] = await Promise.all([
      fetch(busUrl1).then((response) => response.json()),
      fetch(busUrl2).then((response) => response.json()),
    ]);

    combinedBusData = {
      type: "FeatureCollection",
      features: [...busData1.features, ...busData2.features],
    };

    for (let i = 0; i < 5; i++) {
      if (map.getSource(sources[i])) {
      } else {
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
    }
    toggleAll();
  });

  function toggle(index, draw) {
    map.setLayoutProperty(
      layers[index],
      "visibility",
      stopStatuses["show"][index] ? "visible" : "none"
    );
    if (draw) {
      // TODO add ...&& switchStatus[index]
      stopStatuses["switchStatus"][index] = stopStatuses["switchStatus"][index];
    } else if (
      stopStatuses["switchStatus"][index] == stopStatuses["show"][index]
    ) {
    } else {
      stopStatuses["switchStatus"][index] =
        !stopStatuses["switchStatus"][index];
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

    if (stopLayerToggle == "bus" && stopStatuses["switchStatus"][0] == false) {
      stopStatuses["show"][0] = !stopStatuses["show"][0];
      toggle(0, true);
    } else if (
      stopLayerToggle == "rail" &&
      stopStatuses["switchStatus"][1] == false
    ) {
      stopStatuses["show"][1] = !stopStatuses["show"][1];
      toggle(1, true);
    } else if (
      stopLayerToggle == "ferry" &&
      stopStatuses["switchStatus"][4] == false
    ) {
      stopStatuses["show"][4] = !stopStatuses["show"][4];
      toggle(4, true);
    } else if (
      stopLayerToggle == "tube_lightrail_metro" &&
      stopStatuses["switchStatus"][2] == false
    ) {
      stopStatuses["show"][2] = !stopStatuses["show"][2];
      toggle(2, true);
    } else if (
      stopLayerToggle == "tram" &&
      stopStatuses["switchStatus"][3] == false
    ) {
      stopStatuses["show"][3] = !stopStatuses["show"][3];
      toggle(3, true);
    } else {
      console.log("Error in toggleOnDraw function");
    }
  }

  function toggleOffDrawing() {
    for (let i = 0; i < stopStatuses["show"].length; i++) {
      if (stopStatuses["show"][i] && !stopStatuses["switchStatus"][i]) {
        stopStatuses["show"][i] = !stopStatuses["show"][i];
        toggle(i, true);
      }
    }
  }
</script>

{#if stopLayerToggle == "bus" || stopLayerToggle == "rail" || stopLayerToggle == "ferry" || stopLayerToggle == "tube_lightrail_metro" || stopLayerToggle == "tram"}
  {toggleOnDraw(stopLayerToggle)}
{/if}

{#if stopLayerToggle == "toggle_drawing_off"}
  {toggleOffDrawing()}
{/if}
