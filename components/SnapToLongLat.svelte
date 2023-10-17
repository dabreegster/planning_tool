<script>
  import { getContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  let longtiude = 0;
  let latitude = 0;

  async function snapToLongLat() {
    let coords = [longtiude, latitude];
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

  function handleLongitudeInput(event) {
    longtiude = event.target.value;
  }

  function handleLatitudeInput(event) {
    latitude = event.target.value;
  }
</script>

<div style="font-size: 0.9rem;">
  Longitude:
  <input
    type="text"
    style="width: 90px; background-color: white; border: 1px solid black;"
    on:input={handleLongitudeInput}
    on:keydown={handleKeyPress}
  />
  <div style="float: right; font-size: 0.9rem;">
    Latitude:
    <input
      type="text"
      style="width: 90px; background-color: white; border: 1px solid black; "
      on:input={handleLatitudeInput}
      on:keydown={handleKeyPress}
    />
  </div>
</div>

<style>
</style>
