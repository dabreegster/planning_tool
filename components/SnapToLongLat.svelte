<script>
  import { getContext } from "svelte";
  import { areaSearchDictionary } from "../stores.js";

  const { getMap } = getContext("map");
  const map = getMap();

  async function snapToLongLat() {
    let latitude = $areaSearchDictionary.latlong["latitude"]
    let longitude = $areaSearchDictionary.latlong["longitude"]
    if (!latitude || !longitude) {
      alert(
        "Please enter valid longitude/latitude coordinates\n -180 ≤ Longitude ≤ 180\n -90 ≤ Latitude ≤ 90"
      );
      return;
    }
    if (
      longitude <= 180 &&
      longitude >= -180 &&
      latitude <= 90 &&
      latitude >= -90
    ) {
      let coords = [longitude, latitude];
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

</script>

<div style="font-size: 0.9rem;">
  Latitude:
  <input
    type="text"
    bind:value={$areaSearchDictionary.latlong["latitude"]}
    on:keydown={handleKeyPress}
  />
  <button class="go_button" on:click={snapToLongLat}>Go</button>
  <div style="float: right; margin-right: 10px;">
    Longitude:
    <input
      type="text"
      bind:value={$areaSearchDictionary.latlong["longitude"]}
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
