<script>
  import { getContext } from "svelte";
  import proj4 from "proj4";

  const { getMap } = getContext("map");
  const map = getMap();

  // configuration for OSGB easting/northing -> lat/long conversion
  var osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs";
  var wgs84 = "+proj=longlat +ellps=WGS84 +towgs84=0,0,0 +no_defs";

  let easting = 0;
  let northing = 0;

  async function snapToLongLat() {
    // convert easting/northing -> longitude/latitude
    let longitudeLatitude = proj4(osgb, wgs84, [
      parseFloat(easting),
      parseFloat(northing),
    ]);
    let coords = [longitudeLatitude[0], longitudeLatitude[1]];
    map.jumpTo({
      center: coords,
      zoom: 14,
    });
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      snapToLongLat();
    }
  }

  function handleEastingInput(event) {
    easting = event.target.value;
  }

  function handleNorthingInput(event) {
    northing = event.target.value;
  }
</script>

<div class="whitebox">
  Easting:
  <input
    type="text"
    style="font-size: 1.2rem; width: 100px; background-color: white; border: 1px solid black;"
    on:input={handleEastingInput}
    on:keydown={handleKeyPress}
  />
  Northing:
  <input
    type="text"
    style="font-size: 1.2rem; width: 100px; background-color: white; border: 1px solid black;"
    on:input={handleNorthingInput}
    on:keydown={handleKeyPress}
  />
</div>

<style>
  .whitebox {
    /* background-color: white;
    position: absolute;
    padding: 16px;
    border-radius: 10px;
    right: 10px;
    top: 410px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2); */
    font-size: 1.2rem;
  }
</style>
