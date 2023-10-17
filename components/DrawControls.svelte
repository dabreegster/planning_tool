<script>
  import MapboxDraw from "@mapbox/mapbox-gl-draw";
  import * as turf from "@turf/turf";
  import proj4 from "proj4";
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
  import { get } from "svelte/store";

  import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
  // potentially redundant with only 1 draw polygon purpose
  let area_toggle = "select_area";
  export let line_toggle = "new_pt_route";

  // configuration for lat/long -> OSGB easting northing conversion
  var osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs";
  var wgs84 = "+proj=longlat +ellps=WGS84 +towgs84=0,0,0 +no_defs";

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
  // allow if total < 10_000_000m^2 ~ 1000 squares
  const maxAreaSize = 10_000_000;
  let drawControlsToggle;
  export let open = false;
  export let stopLayerToggle;
  export let drawing = false;
  $: {
    if (open["headRight"]) {
      drawControlsToggle = "on";
    } else {
      drawControlsToggle = "off";
    }
  }
  $: {
    if (drawing) {
      if (line_toggle == "new_pt_route") {
        drawControls.changeMode("draw_line_string");
      }
    }
  }
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
        // check if over X area total (set below)
        let currentTotalArea = 0;
        for (var i = 0; i < get(gjScheme).features.length; i++) {
          let feat = get(gjScheme).features[i];
          if (feat.geometry.type == "Polygon" && feat.properties.select_area) {
            currentTotalArea += feat.properties.areaSquareMeters;
          }
        }
        console.log(get(gjScheme));
        // allow only if total of areas < maxAreaSize
        if (turf.area(feature.geometry) + currentTotalArea < maxAreaSize) {
          feature.properties.select_area = true;
          addGeometricProperties(feature);
          let squareIDsWithinArea = findsquareIDsWithinArea(feature);
          feature.properties["squareIDs"] = squareIDsWithinArea;
        } else {
          // if too large return nothing and alert customer of limitations
          let totalArea = (
            (turf.area(feature.geometry) + currentTotalArea) /
            1_000_000
          ).toFixed(2);
          alert(
            "Total area too large: \n\nCurrent: " +
              totalArea +
              "km\u00B2" +
              "\nMax " +
              maxAreaSize / 1_000_000 +
              "km\u00B2 \n\nPlease select a smaller area"
          );
          return;
        }
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
      drawing = false;
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
      feature.properties.lengthKm = turf.length(feature.geometry);
    } else {
      feature.properties.centroid = turf.centroid(feature.geometry);
      feature.properties.areaSquareMeters = turf.area(feature.geometry);
    }
  }

  function addNewBus() {
    drawing = true;
    stopLayerToggle = "bus";
    line_toggle = "new_pt_route";
    drawControls.changeMode("draw_line_string");
  }
  function addNewTrain() {
    drawing = true;
    stopLayerToggle = "rail";
    line_toggle = "new_pt_route";
    drawControls.changeMode("draw_line_string");
  }
  function addNewFerry() {
    drawing = true;
    stopLayerToggle = "ferry";
    line_toggle = "new_pt_route";
    drawControls.changeMode("draw_line_string");
  }
  function addNewUnderground() {
    drawing = true;
    stopLayerToggle = "tube_lightrail_metro";
    line_toggle = "new_pt_route";
    drawControls.changeMode("draw_line_string");
  }
  function addNewTram() {
    drawing = true;
    stopLayerToggle = "tram";
    line_toggle = "new_pt_route";
    drawControls.changeMode("draw_line_string");
  }
  // function addNewFootpath() {
  //   drawing = true;
  //   line_toggle = "new_pathway";
  //   drawControls.changeMode("draw_line_string");
  // }
  function addNewSelectedArea() {
    drawing = true;
    area_toggle = "select_area";
    drawControls.changeMode("draw_polygon");
  }

  // find the min and max x and y coordinates of an area
  function findMinMaxes(coords) {
    // Initialize the maximum and minimum values with the first coordinate
    let maxX = coords[0][0];
    let minX = coords[0][0];
    let maxY = coords[0][1];
    let minY = coords[0][1];

    // Iterate over the remaining coordinates
    for (let i = 1; i < coords.length; i++) {
      const [x, y] = coords[i];

      // Update the maximum and minimum x values
      if (x > maxX) {
        maxX = x;
      } else if (x < minX) {
        minX = x;
      }

      // Update the maximum and minimum y values
      if (y > maxY) {
        maxY = y;
      } else if (y < minY) {
        minY = y;
      }
    }

    // Return an object containing the maximum and minimum values
    return { maxX, minX, maxY, minY };
  }

  function createListOfPossibleCentroids(minMaxes) {
    // Convert latitude/longitude to easting/northing
    let eastingNorthingMin = proj4(wgs84, osgb, [minMaxes.minX, minMaxes.minY]);
    let eastingNorthingMax = proj4(wgs84, osgb, [minMaxes.maxX, minMaxes.maxY]);

    // Round maxes up and mins down to nearest 100 to find the full boundaries
    let eMin = Math.floor(eastingNorthingMin[0] / 100);
    let nMin = Math.floor(eastingNorthingMin[1] / 100);
    let eMax = Math.ceil(eastingNorthingMax[0] / 100);
    let nMax = Math.ceil(eastingNorthingMax[1] / 100);

    let possibleCentroids = [];
    for (let e = eMin; e < eMax; e++) {
      for (let n = nMin; n < nMax; n++) {
        possibleCentroids.push([e * 100 + 50, n * 100 + 50]);
      }
    }
    return possibleCentroids;
  }

  function findCentroidsWithinArea(coords, possibleCentroids) {
    // convert coords to easting/northing
    let eastingNorthingCoords = [];
    for (let i = 0; i < coords.length; i++) {
      eastingNorthingCoords.push(
        proj4(wgs84, osgb, [coords[i][0], coords[i][1]])
      );
    }

    // create polygon of feature
    let areaFeature = turf.polygon([eastingNorthingCoords]);

    let squareIDsWithinArea = [];

    // Iterate over the list of possible Centroids
    for (let i = 0; i < possibleCentroids.length; i++) {
      let centroid = possibleCentroids[i];

      // Create a Turf.js point feature for each coordinate
      let centroidFeature = turf.point(centroid);

      // Check if the point is within the polygon
      let isWithinArea = turf.booleanPointInPolygon(
        centroidFeature,
        areaFeature
      );
      // If the point is within the polygon, do something
      if (isWithinArea) {
        // Convert to string to become squareID
        let squareID = centroid[0].toString() + "_" + centroid[1].toString();
        squareIDsWithinArea.push(squareID);
      }
    }
    return squareIDsWithinArea;
  }

  function findsquareIDsWithinArea(feature) {
    let coords = feature.geometry.coordinates[0];
    let minMaxes = findMinMaxes(coords);
    let possibleCentroids = createListOfPossibleCentroids(minMaxes);

    let squareIDsWithinArea = findCentroidsWithinArea(
      coords,
      possibleCentroids
    );
    return squareIDsWithinArea;
  }

  // function findCurrentTotalSquareIDs(gj) {
  //   let allSqaureIDs = [];

  //   for (let i = 0; i < gj.features.length; i++) {
  //     let squareIDs = gj.features[i].properties["squareIDs"];
  //     for (let x = 0; x < squareIDs.length; x++) {
  //       allSqaureIDs.push(squareIDs[x]);
  //     }
  //   }
  //   return new Set(allSqaureIDs);
  // }
</script>
<!-- 
<button
  class={drawControlsToggle}
  title="Add new bus route"
  style="top: 10px;"
  on:click={addNewBus}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/bus-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={drawControlsToggle}
  title="Add new national rail route"
  style="top: 75px;"
  on:click={addNewTrain}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/train-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={drawControlsToggle}
  title="Add new ferry route"
  style="top: 136px;"
  on:click={addNewFerry}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/ferry-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={drawControlsToggle}
  title="Add new tram route"
  style="top: 198px;"
  on:click={addNewTram}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/tram-icon.png"
    style="height: 32; width: 32px;"
  />
</button>

<button
  class={drawControlsToggle}
  title="Add new underground/metro/light rail route"
  style="top: 260px;"
  on:click={addNewUnderground}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/underground-icon.png"
    style="height: 32; width: 32px;"
  />
</button> -->

<!-- <button
  class={drawControlsToggle}
  style="top: 198px;"
  on:click={addNewFootpath}
>
  <img
    src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/footpath-icon.png"
    style="height: 32; width: 32px;"
  />
</button> -->

<button
  class={drawControlsToggle}
  title="Select area of interest"
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

  .on {
    z-index: 1;
    position: absolute;
    left: calc(25% + 20px);
    padding: 10px;
    border-radius: 5px;
    background: white;
    padding: 10px;
  }
  .off {
    display: none;
  }
</style>
