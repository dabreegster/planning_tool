<script>
  import { getContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  let longtiude = 0;
  let latitude = 0;

  async function snapToLongLat() {
    if (
      longtiude <= 180 &&
      longtiude >= -180 &&
      latitude <= 90 &&
      latitude >= -90
    ) {
      let coords = [longtiude, latitude];
      map.jumpTo({
        center: coords,
        zoom: 14,
      });
    } else {
      alert(
        "Please enter valid longitude/latitude coordinates\n -180 ≤ Longitude ≤ 180\n -90 ≤ Latitude ≤ 90"
      );
    }
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
    on:input={handleLongitudeInput}
    on:keydown={handleKeyPress}
  />
  <button class="go_button" on:click={snapToLongLat}>Go</button>
  <div style="float: right; margin-right: 10px;">
    Latitude:
    <input
      type="text"
      on:input={handleLatitudeInput}
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
