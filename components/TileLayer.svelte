<script>
  import { onMount, getContext, setContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  export let tileOpacity = 50;
  // TODO Revert, this is nicer for development
  export let tileScoreLayer = "Overall Connectivity";

  let PMTILES_BUCKET_URL =
    "https://storage.googleapis.com/very-nice-tiles-bucket/";
  const layer = "tiles";

  let modes = ["PT", "walking", "cycling", "driving"];

  let purposes = [
    "Business",
    "Education",
    // "Health",  // temp removed as get error
    "Entertainment",
    "Shopping",
    "Residential",
  ];

  function addSource(purpose, mode) {
    let source = purpose + " by " + mode;
    let tileModeString;
    if (map.getSource(source)) {
    } else {
      console.log();
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
    // Temp added for default tile layer until actual tiles made
    if (tileScoreLayer == "Overall Connectivity") {
      map.addLayer({
        id: layer,
        type: "raster",
        source: "Business by PT",
        paint: {
          "raster-opacity": tileOpacity / 100,
        },
      });
    }
    if (tileScoreLayer != "Hide") {
      map.addLayer({
        id: layer,
        type: "raster",
        source: tileScoreLayer,
        paint: {
          "raster-opacity": tileOpacity / 100,
        },
      });
    }
  }

  $: setLayer();

  $: {
    console.log(tileScoreLayer)
    setContext("tileOpacity", tileOpacity);
    setLayer();
  }
</script>

<style>
 
</style>
