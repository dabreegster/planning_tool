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
    // setLayer();
  });

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }

    let layers = map.getStyle().layers;
    console.log("layers");
    console.log(layers);

    let beforeID = null;
    if (map.getLayer("draggable-points.cold")) {
      // add below draggable-points.cold
      beforeID = "draggable-points.cold";
    }
    console.log("beforeID");
    console.log(beforeID);
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
      setContext("tileOpacity", tileOpacity);
      setLayer();
    }
  }

  let layers = map.getStyle().layers;
  console.log("layers");
  console.log(layers);

  onMount(() => {
    setTimeout(() => {
      tileScoreLayer = "Overall Connectivity"; // Hide the accordion after 0.1 seconds.
    }, 10);
  });
</script>

<style>
 
</style>
