<script>
  import { onMount, getContext, setContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  export let tileOpacity = 50;
  // TODO Revert, this is nicer for development
  export let tileScoreLayer = null;

  let PMTILES_BUCKET_URL =
    "https://storage.googleapis.com/very-nice-tiles-bucket/";
  const layer = "tiles";

  let modes = ["PT", "walking", "cycling", "driving"];

  let purposes = [
    "Business",
    "Education",
    // "Health",  // temp removed as get error as no PT health
    "Entertainment",
    "Shopping",
    "Residential",
  ];

  function addSource(purpose, mode) {
    let source = purpose + " by " + mode;
    let tileModeString;
    if (map.getSource(source)) {
    } else {
      if (mode === "PT") {
        tileModeString = "";
      } else if (mode === "walking") {
        tileModeString = "_walk";
      } else if (mode === "cycling") {
        tileModeString = "_cycling";
      } else {
        tileModeString = "_car";
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
    // load in base scores on arrival
    tileScoreLayer = "Overall Connectivity";
  });

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    // let layers = map.getStyle().layers;
    // console.log("layers");
    // console.log(layers);
    let beforeID = null;
    if (map.getLayer("base-line.cold")) {
      // add below base-line.cold
      beforeID = "base-line.cold";
    }
    // Temp added for default tile layer until actual tiles made
    if (tileScoreLayer == "Overall Connectivity") {
      map.addLayer({
        id: layer,
        type: "raster",
        source: "Business by PT",
        paint: {
          "raster-opacity": tileOpacity / 100,
        },
      },
      beforeID,
      );
    } else if (tileScoreLayer != "Hide") {
      map.addLayer({
        id: layer,
        type: "raster",
        source: tileScoreLayer,
        paint: {
          "raster-opacity": tileOpacity / 100,
        },
      },
      beforeID,
      );
    }
  }

  $: {
    console.log(tileScoreLayer)
    if (tileScoreLayer) {
      setLayer();
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
