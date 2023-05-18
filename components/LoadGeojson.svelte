<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import { getSquareInfo, callFloodfillApi } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  const source = "squareInfoGeoJson";
  const pointLayer = "floodPoints";
  const lineLayer = "floodLines";
  const squareLayer = "squareOutline";
  let startTimeSeconds = 28800;

  export let squareID;
  let maxPerPurpose;
  let purpose = "Business";
  export let hoverInfo = "no_selection";

  function emptyGeojson() {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  function resetMapAndID() {
    squareID = null;
    map.getSource(source).setData(squareInfoGeoJson);
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
    if (startTimeSeconds >= 21600 && startTimeSeconds <= 79200) {
      console.log(`Lookup square for ${e.lngLat}`);
      console.time("square API");
      let info = await getSquareInfo(e.lngLat);
      console.timeEnd("square API");
      if (info == "click_not_on_square") {
        return;
      }
      squareID = info.name;
      // set square coords to make square in question
      let squareCoords = info["square_coords"];
      delete info["square_coords"];

      // Now make the floodfill request
      let req = {
        ...info,
        trip_start_seconds: startTimeSeconds,
      };
      console.time("floodfill API");
      let resp = await callFloodfillApi(req);
      console.timeEnd("floodfill API");

      dataChanged(resp, squareCoords);
    } else {
      alert("Start time must be between 06:00 and 22:00");
    }
  });

  function convertStringToFloatArr(string) {
    let [long, lat] = string.split(",");
    return [parseFloat(long), parseFloat(lat)];
  }

  function dataChanged(resp, squareCoords) {
    let gj = emptyGeojson();

    console.time("Build GJ data");
    // Circles for destinations
    for (let [purpose, top3] of resp.key_destinations_per_purpose.entries()) {
      for (let pt of top3) {
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

    // Lines for links
    maxPerPurpose = [0.0, 0.0, 0.0, 0.0, 0.0];
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
          Entertainment: scorePerPurpose[2],
          Shopping: scorePerPurpose[3],
          Residential: scorePerPurpose[4],
          link_type: resp.link_is_pt[linkID],
          routeDetails: resp.link_route_details[linkID],
          name: "link",
        },
        id: linkID,
      });
    }
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
    map.addLayer({
      source,
      id: pointLayer,
      filter: ["all", ["==", "$type", "Point"], ["==", "purpose", purposeIdx]],
      type: "circle",
      paint: {
        "circle-radius": 10.0,
        "circle-color": "white",
        "circle-opacity": 1.0,
        "circle-stroke-color": "black",
        "circle-stroke-width": 2,
      },
    });
    map.addLayer({
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
    });
    map.addLayer({
      source,
      id: squareLayer,
      filter: ["all", ["==", "$type", "LineString"], ["==", "name", "square"]],
      type: "line",
      paint: {
        "line-color": "#000000",
        "line-width": 3,
      },
    });

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

  map.on("contextmenu", function () {
    resetMapAndID();
  });

  let purposes = [
    "Business",
    "Education",
    "Entertainment",
    "Shopping",
    "Residential",
  ];

  function updateStartTime(timeString) {
    let [hours, minutes] = timeString.target.value.split(":");
    startTimeSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
  }
</script>

<div class="purposeBox" style="display: flex;">
  <label
    class="govuk-label"
    for="purpose"
    style="margin-right: 10px; margin-top: 5px; font-size: 1.2rem;"
  >
    Displayed route purpose:
  </label>
  <select
    class="govuk-select"
    id="purpose"
    name="purpose"
    bind:value={purpose}
    on:change={setLayers}
  >
    {#each purposes as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<button class="govuk-label" style="font-size: 1.2rem;" on:click={resetMapAndID}
  >Clear polygons (right click)
</button>

<div class="startTimeSelection">
  <label for="start-time-input">Start Time:</label>
  <input
    id="start-time-input"
    type="time"
    name="start-time-input"
    value="08:00"
    min="06:00"
    max="22:00"
    style="font-size: 15px; padding:5px"
    on:change={(e) => updateStartTime(e)}
  />
  <span class="validity" />
</div>

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
    top: 68px;
    left: 10px;
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
    top: 131px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    font-size: 1.2rem;
  }

  input + span {
    padding-right: 30px;
  }

  input:invalid + span::after {
    position: absolute;
    content: "✖";
    padding-left: 5px;
  }

  input:valid + span::after {
    position: absolute;
    content: "✓";
    padding-left: 5px;
  }
</style>
