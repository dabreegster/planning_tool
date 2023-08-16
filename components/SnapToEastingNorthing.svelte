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
    let longitudeLatitude = proj4(osgb, wgs84, [parseFloat(easting), parseFloat(northing)]);
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
  <input
    type="text"
    style="font-size: 1.2rem; width: 235px"
    placeholder="Easting"
    on:input={handleEastingInput}
    on:keydown={handleKeyPress}
  />
  <input
  type="text"
  style="font-size: 1.2rem; width: 235px"
  placeholder="Northing"
  on:input={handleNorthingInput}
  on:keydown={handleKeyPress}
/>
<svg
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z"
      fill="#0D0D0D"
    />
  </svg>
</div>


<style>
  .whitebox {
    background-color: white;
    position: absolute;
    padding: 16px;
    border-radius: 10px;
    right: 10px;
    top: 410px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    font-size: 1.2rem;
  }
</style>
