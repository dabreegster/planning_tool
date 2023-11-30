<script>
  import { lookupPostcode } from "../api.js";
  import { getContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  let postcode = "";

  async function snapToPostcode() {
    let response = await lookupPostcode(postcode);
    if (response == "no_match") {
      alert("Please enter a valid postcode");
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

<div class="postcode">
  Move to postcode:
  <input
    type="text"
    style="font-size: 14px; width: calc(100% - 180px); background-color: white; border: 1px solid black;"
    on:input={handleInput}
    on:keydown={handleKeyPress}
  />
  <button class="go_button" on:click={snapToPostcode}>Go</button>
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
</style>
