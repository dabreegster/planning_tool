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
  <input
    type="text"
    style="font-size: 1.3rem; width: 160px"
    placeholder="Find postcode..."
    on:input={handleInput}
    on:keydown={handleKeyPress}
  />
  <svg fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path xmlns="http://www.w3.org/2000/svg" d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="#0D0D0D"></path>
    </svg>
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
