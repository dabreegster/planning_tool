<script>
  import { lookupPostcode } from "../api.js";
  import { getContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  let postcode = "";

  async function snapToPostcode() {
    let response = await lookupPostcode(postcode);
    if (response == "no_match") {
      // TODO return no postcode found for none
    } else {
      let coords = response["postcodeMatch"];
      map.jumpTo({
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
</script>

<div class="whitebox">
  Jump to postcode
  <input
    type="text"
    style="font-size: 1.3rem; width: 150px"
    placeholder="Enter postcode"
    on:input={handleInput}
    on:keydown={handleKeyPress}
  />
</div>

<style>
  .whitebox {
    background-color: white;
    position: absolute;
    padding: 16px;
    border-radius: 10px;
    right: 10px;
    top: 293px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    font-size: 1.5rem;
  }
</style>
