<script>
  import MapboxDraw from "@mapbox/mapbox-gl-draw";
  import length from "@turf/length";
  import centroid from "@turf/centroid";
  import area from "@turf/area";
  import {
    isPoint,
    drawCircle,
    isLine,
    drawLine,
    isPolygon,
    drawPolygon,
  } from "../style.js";
  import { onMount, getContext } from "svelte";
  import { lookupPathway, lookupPTRoute } from "../api.js";

  import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
  let area_toggle = "new_building";
  let line_toggle = "new_pt_route";

  const { getMap } = getContext("map");
  import {
    gjScheme,
    currentMapHover,
    setCurrentlyEditing,
    clearCurrentlyEditing,
    currentlyEditing,
  } from "../stores.js";

  const color = "black";
  const circleRadius = 5.5;
  const lineWidth = 4;
  export let leftSidebarClassToggle;
  export let stopLayerToggle;
  const styles = [
    {
      id: "draggable-points",
      filter: ["all", isPoint, ["!=", "meta", "feature"]],
      // TODO The 1.5 is bulky and ugly, but I can't figure out how to get z-ordering working
      ...drawCircle("blue", 1.5 * circleRadius),
    },
    {
      id: "base-line",
      filter: isLine,
      ...drawLine(color, lineWidth),
    },
    {
      id: "base-polygon-fill",
      filter: isPolygon,
      ...drawPolygon(color, 0.1),
    },
    {
      id: "base-polygon-outline",
      filter: isPolygon,
      ...drawLine(color, lineWidth / 1.5),
    },
  ];

  let drawControls;

  onMount(async () => {
    const map = getMap();

    drawControls = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        polygon: true,
      },
      styles: styles,
    });
    map.addControl(drawControls);

    // When we draw a new feature, add it to the store
    map.on("draw.create", async (e) => {
      let ptmode = stopLayerToggle;
      stopLayerToggle = "toggle_drawing_off";
      // Assume there's exactly 1 feature
      const feature = e.features[0];
      if (feature.geometry.type == "Polygon" && area_toggle == "select_area") {
        feature.properties.select_area = true;
      } else if (
        feature.geometry.type == "LineString" &&
        line_toggle == "new_pathway"
      ) {
        feature.properties.new_pathway = true;
        feature.properties["line_toggle"] = line_toggle;
        await lookupPathway(feature);
        addGeometricProperties(feature);
      } else if (feature.geometry.type == "LineString") {
        feature.properties["line_toggle"] = line_toggle;
        feature.properties["ptMode"] = ptmode;
        await lookupPTRoute(feature);
        addGeometricProperties(feature);
      } else {
        addGeometricProperties(feature);
      }
      gjScheme.update((gj) => {
        gj.features.push(feature);
        return gj;
      });
    });

    map.on("draw.update", async (e) => {
      // Assume there's exactly 1 feature
      const feature = e.features[0];
      if (
        feature.geometry.type == "LineString" &&
        feature.properties.new_pathway
      ) {
        await lookupPathway(feature);
        addGeometricProperties(feature);
      } else if (feature.geometry.type == "LineString") {
        drawControls.set($gjScheme);
        return;
      } else {
        addGeometricProperties(feature);
      }

      gjScheme.update((gj) => {
        const update = gj.features.find((f) => f.id == feature.id);
        update.geometry = feature.geometry;
        // Overwrite any geometric properties
        update.properties = { ...update.properties, ...feature.properties };
        return gj;
      });
    });

    map.on("draw.selectionchange", (e) => {
      if (e.features.length == 1) {
        setCurrentlyEditing(e.features[0].id);
      } else if (e.features.length == 0) {
        clearCurrentlyEditing();
      }
    });

    // When the store changes, update the drawn objects
    // TODO Form changes will trigger this unnecessarily. Maybe split out geometry and properties?
    gjScheme.subscribe((gj) => {
      drawControls.set(gj);
    });

    // Highlight something in the sidebar when we hover on a feature in the map
    map.on("mousemove", (e) => {
      var newHoverEntry = null;
      // TODO This whines about a layer missing, and I can't suppress with try/catch
      const ids = drawControls.getFeatureIdsAt(e.point);
      if (ids.length > 0) {
        newHoverEntry = ids[0];
      }
      currentMapHover.set(newHoverEntry);
    });
    map.on("mouseout", () => {
      currentMapHover.set(null);
    });

    currentlyEditing.subscribe((id) => {
      if (id) {
        let feature = $gjScheme.features.find((f) => f.id == id);
        drawControls.changeMode("direct_select", {
          featureId: feature.id,
        });
      }
    });
  });

  function addGeometricProperties(feature) {
    if (feature.geometry.type == "LineString") {
      feature.properties.lengthKm = length(feature.geometry);
    } else {
      feature.properties.centroid = centroid(feature.geometry);
      feature.properties.areaSquareMeters = area(feature.geometry);
    }
  }

  function addNewBus() {
    stopLayerToggle = "bus";
    line_toggle = "new_pt_route";
    drawControls.changeMode("draw_line_string");
  }
  function addNewTrain() {
    stopLayerToggle = "rail";
    line_toggle = "new_pt_route";
    drawControls.changeMode("draw_line_string");
  }
  function addNewFerry() {
    stopLayerToggle = "ferry";
    line_toggle = "new_pt_route";
    drawControls.changeMode("draw_line_string");
  }
  function addNewFootpath() {
    line_toggle = "new_pathway";
    drawControls.changeMode("draw_line_string");
  }
  function addNewBuilding() {
    area_toggle = "new_building";
    drawControls.changeMode("draw_polygon");
  }
  function addNewSelectedArea() {
    area_toggle = "select_area";
    drawControls.changeMode("draw_polygon");
  }
</script>

<button class={leftSidebarClassToggle} style="top: 10px;" on:click={addNewBus}>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/bus-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={leftSidebarClassToggle}
  style="top: 75px;"
  on:click={addNewTrain}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/train-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={leftSidebarClassToggle}
  style="top: 136px;"
  on:click={addNewFerry}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/ferry-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={leftSidebarClassToggle}
  style="top: 198px;"
  on:click={addNewFootpath}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/footpath-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={leftSidebarClassToggle}
  style="top: 260px;"
  on:click={addNewBuilding}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/building-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={leftSidebarClassToggle}
  style="top: 320px;"
  on:click={addNewSelectedArea}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/area-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<style>
  :global(.mapboxgl-ctrl-group > button) {
    width: 50px;
    height: 50px;
  }

  :global(.mapbox-gl-draw_polygon, .mapbox-gl-draw_line) {
    display: none !important;
  }

  .sidebar {
    z-index: 1;
    position: absolute;
    left: calc(25% + 20px);
    padding: 10px;
    border-radius: 5px;
    background: white;
    padding: 10px;
  }
  .blank {
    display: none;
  }
</style>
