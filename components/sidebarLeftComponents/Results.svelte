<script>
  import Spinner from "svelte-spinner";
  // import DebugApi from "./DebugApi.svelte";
  import { gjScheme } from "../../stores.js";
  import { geojsonToApiPayload, callApi } from "../../api.js";
  import { get } from "svelte/store";

  let requestJson;
  export let responseJson;
  export let login_username;
  export let loading = false;

  async function recalculate() {
    // assert that there are some squares selected before
    let totalSquares = 0;
    for (var i = 0; i < get(gjScheme).features.length; i++) {
      let feat = get(gjScheme).features[i];
      if (feat.geometry.type == "Polygon" && feat.properties.select_area) {
        totalSquares += feat.properties.squareIDs.length;
      }
    }
    if (totalSquares > 0) {
      responseJson = null;
      loading = true;
      requestJson = await geojsonToApiPayload(
        $gjScheme.features,
        login_username
      );
      if (requestJson == "stop_lookup_error") {
        loading = false;
        return;
      }
      responseJson = await callApi(requestJson);
      // TODO remove this if statement after prototyping phase
      if (responseJson.hasOwnProperty("too_expensive")) {
        loading = false;
        responseJson = null;
        alert(
          "This requests is currently over the threshold cost limit for the prototype"
        );
      } else {
        console.log(responseJson);
        loading = false;
      }
    } else {
      alert("Please select the impact areas you are interested in");
      return;
    }
  }
</script>

<button
  type="button"
  title="Calculate impact of new scheme on impact areas"
  disabled={$gjScheme.features.length == 0 || loading}
  on:click={recalculate}
  >Calculate impact
</button>

{#if loading}
  <Spinner class="spinner" />
{/if}

<!-- <DebugApi {requestJson} {responseJson} /> -->


<style>

  button {
    flex: 1; /* Distribute available space equally between headers */
    background: #00703c;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    padding: 8px 10px;
    transition: background-color 0.3s ease-in-out;
    font-size: 1rem;
  }

  button:hover {
    background: #005a31;
  }
</style>
