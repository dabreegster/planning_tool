<script>
  import { onMount, getContext, setContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  export let tileOpacity = 50;
  export let tileSettings = {
    toggle: false,
    level: "National",
    mode: "Overall",
    purpose: "Overall",
    LA: "Hide",
  };

  let PMTILES_BUCKET_URL =
    "https://storage.googleapis.com/very-nice-tiles-bucket/";
  const layer = "nationalTiles";
  let modes = ["Overall", "Public transport", "Walking", "Cycling", "Driving"];

  let purposes = [
    "Overall",
    "Business",
    "Education",
    "Entertainment",
    // "Health", // temp removed as get error as no PT health
    "Shopping",
    "Residential",
  ];

  function addSource(purpose, mode) {
    let source = purpose + "_" + mode;
    let tileModeString;
    if (map.getSource(source)) {
    } else {
      if (mode === "Public transport") {
        tileModeString = "";
      } else if (mode === "Walking") {
        tileModeString = "_walk";
      } else if (mode === "Cycling") {
        tileModeString = "_cycling";
      } else if (mode == "Driving") {
        tileModeString = "_car";
      } else {
        // TODO update this with else if (mode == "Overall")
        // currently just set the same as PT
        tileModeString = "";
      }
      // TODO update this with else if (purpose == "Overall")
      // currently just set the same as PT
      if (purpose == "Overall") {
        purpose = "Business";
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
    // load in national base scores on arrival
    tileSettings["level"] = "National";
    tileSettings["toggle"] = true;
  });

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    // let layers = map.getStyle().layers;
    // console.log("layers");
    // console.log(layers);
    let beforeID = null;
    if (map.getLayer("editing-lines")) {
      // add below base-line.cold
      beforeID = "editing-lines";
    }
    if (tileSettings["level"] == "National" && tileSettings["toggle"]) {
      map.addLayer(
        {
          id: layer,
          type: "raster",
          source: tileSettings["purpose"] + "_" + tileSettings["mode"],
          paint: {
            "raster-opacity": tileOpacity / 100,
          },
        },
        beforeID
      );
    }
  }

  $: {
    // if toggle on then set layer
    if (tileSettings["toggle"]) {
      setLayer();
    } else {
      // if not then remove
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  }

  // Only reload tiles when opacity slider has decided on a location (mouseup)
  let reloadTiles = false;
  let clickedOnSlider = false;

  // Event listeners for if click used to reload tiles when click off sliders
  // Add event listener for mouse down
  document.addEventListener("mousedown", (e) => {
    let clickedElement = e.target;
    if (clickedElement.tagName !== "DIV") {
      return;
    }
    // checks if the click is on slider
    if (clickedElement.getAttribute("class") === "thumb svelte-1q9yxz9") {
      clickedOnSlider = true;
    }
    reloadTiles = false;
  });

  // Add event listener for mouse up
  document.addEventListener("mouseup", (e) => {
    if (clickedOnSlider) {
      reloadTiles = true;
      clickedOnSlider = false;
    }
  });

  $: {
    if (reloadTiles) {
      setContext("tileOpacity", tileOpacity);
      setLayer();
    }
  }
</script>

<style>
</style>
