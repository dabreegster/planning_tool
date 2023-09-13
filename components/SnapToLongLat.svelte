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

<div class="whitebox">
  Longitude:
  <input
    type="text"
    style="font-size: 1.2rem; width: 100px; background-color: white; border: 1px solid black;"
    on:input={handleLongitudeInput}
    on:keydown={handleKeyPress}
  />
  Latitude:
  <input
    type="text"
    style="font-size: 1.2rem; width: 100px; background-color: white; border: 1px solid black;"
    on:input={handleLatitudeInput}
    on:keydown={handleKeyPress}
  />
</div>

<style>
  .whitebox {
    font-size: 1.2rem;
  }
</style>
