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

  async function snapToEastNothing() {
    // convert easting/northing -> longitude/latitude
    if (
      easting <= 700_000 &&
      easting >= 0 &&
      northing <= 1_300_000 &&
      northing >= 0
    ) {
      let longitudeLatitude = proj4(osgb, wgs84, [
        parseFloat(easting),
        parseFloat(northing),
      ]);
      console.log(longitudeLatitude);
      let coords = [longitudeLatitude[0], longitudeLatitude[1]];
      map.jumpTo({
        center: coords,
        zoom: 14,
      });
    } else {
      alert(
        "Please enter valid easting/northing coordinates\n 0 ≤ Easting ≤ 700,000\n 0 ≤ Northing ≤ 1,300,000"
      );
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      snapToEastNothing();
    }
  }

  function handleEastingInput(event) {
    easting = event.target.value;
  }

  function handleNorthingInput(event) {
    northing = event.target.value;
  }
</script>

<div style="font-size: 0.9rem; margin-left: 17px;">
  Easting:
  <input
    type="text"
    on:input={handleEastingInput}
    on:keydown={handleKeyPress}
  />
  <button class="go_button" on:click={snapToEastNothing}>Go</button>
  <div style="float: right; margin-right: 10px;">
    Northing:
    <input
      type="text"
      on:input={handleNorthingInput}
      on:keydown={handleKeyPress}
    />
  </div>
</div>

<style>
  input {
    width: 75px;
    background-color: white;
    border: 1px solid black;
    margin-top: 4px;
  }
  .go_button {
    background: white;
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 8px;
    font-size: 0.8rem;
    transition: background-color 0.05s ease-in-out;
    float: right;
  }
  .go_button:hover {
    background: #dfdfdf;
  }
</style>
