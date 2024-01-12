<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import { getSquareInfo, callFloodfillApi, getSquareScore } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  const source = "squareInfoGeoJson";
  const pointLayer = "floodPoints";
  const lineLayer = "floodLines";
  const squareLayer = "squareOutline";
  export let startTimeSeconds = 28800;

  export let infoForPDF;
  let maxPerPurpose;
  export let purpose = "Business";
  export let hoverInfo = "no_selection";
  export let toggleDisplayeRouteOnClick;
  let isProcessingClick = false;

  let purposes = [
    "Business",
    "Education",
    "Health",
    "Entertainment",
    "Shopping",
    "Residential",
  ];

  $: {
    if (isProcessingClick) {
      setTimeout(() => {
        isProcessingClick = false;
      }, 8000);
    }
  }

  function emptyGeojson() {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  onMount(() => {
    map.addSource(source, { type: "geojson", data: emptyGeojson() });
  });
  onDestroy(() => {
    for (let layer of [pointLayer, lineLayer, squareLayer]) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    }

    if (map.getSource(source)) {
      map.removeSource(source);
    }
  });

  map.on("click", async function (e) {
    // if either no shift key pressed or toggle is false then don't process click
    if (!(e.originalEvent.shiftKey || toggleDisplayeRouteOnClick)) {
      return;
    }
    if (isProcessingClick) {
      console.log("Click is already being processed");
      return;
    }
    isProcessingClick = true;

    if (startTimeSeconds >= 21600 && startTimeSeconds <= 79200) {
      console.log(`Lookup square for ${e.lngLat}`);
      console.time("square API");
      let info = await getSquareInfo(e.lngLat);
      console.timeEnd("square API");
      if (info == "click_not_on_square") {
        console.log("Click not on square");
        isProcessingClick = false;
        return;
      }
      // set square coords to make square in question
      let squareCoords = info["square_coords"];
      // display the square whilst loading
      let gj = createSquareGeojson(squareCoords);
      let squareID = info["square_ID"];
      delete info["square_coords"];
      delete info["square_ID"];
      // Now make the floodfill request
      let req = {
        ...info,
        trip_start_seconds: startTimeSeconds,
      };
      console.time("floodfill API");
      // console.log(req);
      let resp = await callFloodfillApi(req);
      console.timeEnd("floodfill API");
      console.log(resp);

      console.time("square scores API");
      let squareScores = await getSquareScore(squareID);
      console.timeEnd("square scores API");

      infoForPDF = {
        ...resp,
        squareCoords,
        startTimeSeconds,
        squareScores,
        squareID,
      };
      // console.log("infoForPDF");
      // console.log(infoForPDF);

      dataChanged(resp, gj);
      isProcessingClick = false;
    } else {
      alert("Start time must be between 06:00 and 22:00");
      isProcessingClick = false;
    }
  });

  function convertStringToFloatArr(string) {
    let [long, lat] = string.split(",");
    return [parseFloat(long), parseFloat(lat)];
  }

  function createSquareGeojson(squareCoords) {
    let gj = emptyGeojson();
    // square for outline
    gj.features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: squareCoords,
      },
      properties: {
        name: "square",
      },
    });
    map.getSource(source).setData(gj);

    setSquareLayer();
    return gj;
  }

  function setSquareLayer() {
    if (map.getLayer(squareLayer)) {
      map.removeLayer(squareLayer);
    }
    let beforeID = null;
    if (map.getLayer("bus_layer")) {
      // add below bus_layer
      beforeID = "bus_layer";
    }
    map.addLayer(
      {
        source,
        id: squareLayer,
        filter: ["all", ["==", "$type", "LineString"], ["==", "name", "square"]],
        type: "line",
        paint: {
          "line-color": "#000000",
          "line-width": 3,
        },
      },
      beforeID
    );
  }

  function dataChanged(resp, gj) {
    console.time("Build GJ data");
    // Circles for destinations
    for (let [purpose, top10] of resp.key_destinations_per_purpose.entries()) {
      for (let pt of top10) {
        if (pt[1] === 0) {
          // do nothing as this is not in UK at point [0, 0]
        } else {
          gj.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: pt,
            },
            properties: {
              purpose,
            },
          });
        }
      }
    }

    // Lines for links
    maxPerPurpose = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    for (let [linkID, link] of Object.entries(resp.link_coordinates)) {
      let scorePerPurpose = resp.per_link_score_per_purpose[linkID];
      for (let [i, score] of scorePerPurpose.entries()) {
        maxPerPurpose[i] = Math.max(maxPerPurpose[i], score);
      }
      let [startLong, startLat] = convertStringToFloatArr(link[0]);
      let [endLong, endLat] = convertStringToFloatArr(link[1]);

      gj.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [startLong, startLat],
            [endLong, endLat],
          ],
        },
        properties: {
          Business: scorePerPurpose[0],
          Education: scorePerPurpose[1],
          Health: scorePerPurpose[2],
          Entertainment: scorePerPurpose[3],
          Shopping: scorePerPurpose[4],
          Residential: scorePerPurpose[5],
          link_type: resp.link_is_pt[linkID],
          routeDetails: resp.link_route_details[linkID],
          name: "link",
        },
        id: linkID,
      });
    }
    console.timeEnd("Build GJ data");

    map.getSource(source).setData(gj);

    console.time("Set layers");
    setLayers();
    console.timeEnd("Set layers");
  }

  function setLayers() {
    let purposeIdx = purposes.indexOf(purpose);

    // Reset layers here. We can't configure them once, because the score scaling is dynamic
    for (let layer of [pointLayer, lineLayer, squareLayer]) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    }
    let beforeID = null;
    if (map.getLayer("bus_layer")) {
      // add below bus_layer
      beforeID = "bus_layer";
    }
    map.addLayer(
      {
        source,
        id: squareLayer,
        filter: ["all", ["==", "$type", "LineString"], ["==", "name", "square"]],
        type: "line",
        paint: {
          "line-color": "#000000",
          "line-width": 3,
        },
      },
      beforeID,
    );
    map.addLayer(
      {
        source,
        id: pointLayer,
        filter: ["all", ["==", "$type", "Point"], ["==", "purpose", purposeIdx]],
        type: "circle",
        paint: {
          "circle-radius": 10.0,
          "circle-color": "white",
          "circle-opacity": 0.8,
          "circle-stroke-color": "black",
          "circle-stroke-width": 2,
        },
      },
      // beforeID,
    );
    map.addLayer(
      {
        source,
        id: lineLayer,
        filter: ["all", ["==", "$type", "LineString"], ["==", "name", "link"]],
        type: "line",
        paint: {
          "line-color": [
            "match",
            ["get", "link_type"],
            0,
            "#1f493d",
            1,
            "#EE7C0E",
            // Fallback shouldn't happen
            "red",
          ],
          // sqrt(x) / sqrt(max) * 10
          "line-width": [
            "*",
            10,
            [
              "/",
              ["sqrt", ["get", purpose]],
              Math.sqrt(maxPerPurpose[purposeIdx]),
            ],
          ],
          "line-opacity": 1.0,
        },
      },
      beforeID,
    );

    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point);
      if (features[0]) {
        if (features[0].properties.routeDetails) {
          let feature = features[0];
          if (feature.properties.routeDetails != "{}") {
            hoverInfo = {
              routeDetails: JSON.parse(feature.properties.routeDetails),
              cursorxy: e.point,
            };
          } else {
            hoverInfo = "no_selection";
          }
        } else {
          hoverInfo = "no_selection";
        }
      } else {
        hoverInfo = "no_selection";
      }
    });
  }

  function resetMapAndPDFInfo() {
    infoForPDF = null;
    for (let layer of [pointLayer, lineLayer, squareLayer]) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  }

  // on right click clear map
  map.on("contextmenu", function () {
    resetMapAndPDFInfo();
  });

  // event listener for when purpose changes to set layers again
  $: {
    // uses purpose here just as a listener
    if (purpose) {
      // uses maxPerPurpose to only be able to toggle when data has come in
      // as will only be set after data has arrived
      if (maxPerPurpose) {
        setLayers();
      }
    }
  }
</script>

<!-- 
<button class="govuk-label" style="font-size: 1.2rem;" on:click={resetMapAndID}
  >Clear polygons (right click)
</button> -->
<style>
  button {
    display: false;
    /* z-index: 1;
    position: absolute;
    top: 160px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2); */
  }

  .purposeBox {
    z-index: 1;
    position: absolute;
    top: 327px;
    right: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  }

  select {
    font-size: 1.1rem;
    padding: 4px 8px;
  }
  .startTimeSelection {
    z-index: 1;
    position: absolute;
    top: 222px;
    right: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    font-size: 1.2rem;
  }
</style>
