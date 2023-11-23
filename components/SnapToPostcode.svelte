<script>
  import { lookupPostcode } from "../api.js";
  import { onMount, getContext } from "svelte";
  import maplibregl from "maplibre-gl";
  import GeocodingControl from "@maptiler/geocoding-control/svelte/GeocodingControl.svelte";
  import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl";

  const { getMap } = getContext("map");
  const map = getMap();

  let postcode = "";
  let mapController;
  onMount(() => {
    mapController = createMapLibreGlMapController(map, maplibregl);
  });

  async function snapToPostcode() {
    let response = await lookupPostcode(postcode);
    if (response == "no_match") {
      alert("Please enter a valid postcode");
      // TODO return no postcode found for none
    } else {
      let coords = response["postcodeMatch"];
      map.flyTo({
        center: coords,
        zoom: 14,
      });
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      snapToPostcode();
    }
  }

  function handleInput(event) {
    postcode = event.target.value;
  }
  const apiKey = "KhrJl1uDAOHLgJ4c6Px9";
  const country = "gb"
  const placeholder = "Search for a location";
  const showFullGeometry = false;
  const marker = false;
</script>

<div class="postcode">
  <!-- Move to postcode:
  <input
    type="text"
    style="font-size: 14px; width: calc(100% - 180px); background-color: white; border: 1px solid black;"
    on:input={handleInput}
    on:keydown={handleKeyPress}
  />
  <button class="go_button" on:click={snapToPostcode}>Go</button> -->
  {#if mapController}
    <div class="geocoding">
      <GeocodingControl {mapController} {apiKey} {maplibregl} {country} {placeholder} {showFullGeometry} {marker}/>
    </div>
  {/if}
</div>

<style>
  .postcode {
    font-size: 1rem;
  }
  .go_button {
    background: white;
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 8px;
    font-size: 0.8rem;
    transition: background-color 0.05s ease-in-out;
  }
  .go_button:hover {
    background: #dfdfdf;
  }
  .geocoding {
    padding-left: 0px;
  }
</style>
