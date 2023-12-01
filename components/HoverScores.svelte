<script>
  import proj4 from "proj4";
  import { getContext } from "svelte";
  import { getHoverScores } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  // configuration for lat/long -> OSGB easting northing conversion
  var osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs";
  var wgs84 = "+proj=longlat +ellps=WGS84 +towgs84=0,0,0 +no_defs";

  let scores = {};

  let longitude = null;
  let latitude = null;
  let easting = null;
  let northing = null;
  let squareID = null;
  let freeForRequest = true;
  let lastRequestTime = 0;
  let zoom = map.getZoom();
  let squaresFound = false;
  let open;
  export let hoverScore = null;
  export let tileSettings;

  // if (freeForRequest && open["headLeft"]) {
  if (freeForRequest && tileSettings["level"] == "National" && zoom >= 11.5) {
    map.on("mousemove", async function (e) {
      freeForRequest = false;
      let currentTime = Date.now();
      let timeSinceLastRequest = currentTime - lastRequestTime;

      longitude = e.lngLat.lng;
      latitude = e.lngLat.lat;

      // convert latitude/longitude to easting/northing
      let eastingNorthing = proj4(wgs84, osgb, [longitude, latitude]);
      // round down to nearest 100 and add 50 for centroid of
      easting = Math.floor(eastingNorthing[0] / 100) * 100 + 50;
      northing = Math.floor(eastingNorthing[1] / 100) * 100 + 50;

      squareID = easting.toString() + "_" + northing.toString();

      if (squareID in scores) {
        freeForRequest = true;
        hoverScore = scores[squareID];
        return;
        // Request already made for this squareID, do nothing
      } else {
        // TODO: optimise the request limit
        if (timeSinceLastRequest >= 50) {
          lastRequestTime = currentTime;
          let response = await getHoverScores(squareID, tileSettings["mode"], tileSettings["purpose"]);
          if (response == "not_in_square") {
          } else {
            scores = { ...scores, ...response };
            squaresFound = true;
            freeForRequest = true;
            hoverScore = scores[squareID];
            return;
          }
        }
      }
    });
  }

  // on zoom record the current zoom level
  map.on("zoom", () => {
    zoom = map.getZoom();
  });


  function resetScores() {
    scores = {};
    return;
  }
  $: {
    // if hover scores toggle is turned off then clear and reset scores
    if (open) {
      resetScores();
    }
  }
  $: {
    // when tilesettings change reset scores
    if (tileSettings) {
      resetScores();
      hoverScore = null;
    }
  }
  $: {
    // when zooming out far reset scores
    if (zoom <11.5) {
      resetScores();
      hoverScore = null;
    }
  }
</script>
<!-- <div>
  Score: {showScore(hoverScore)}
</div> -->


<style>
</style>
