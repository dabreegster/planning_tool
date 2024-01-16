<script>
  import { RingLoader } from "svelte-loading-spinners";
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
      try {
        requestJson = await geojsonToApiPayload(
          $gjScheme.features,
          login_username
        );
        console.log(requestJson)
      } catch (error) {
        loading = false;
        alert("An error occurred during your recalculation\n\n Please make sure each route has been filled out completely");
        return;
      };
      if (requestJson == "stop_lookup_error") {
        loading = false;
        return;
      }
      if (typeof requestJson == "string") {
        loading = false;
        alert(`${requestJson}`);
        return;
      }
      // responseJson = await callApi(requestJson);
      // // TODO remove this if statement after prototyping phase
      // if (responseJson.hasOwnProperty("too_expensive")) {
      //   loading = false;
      //   responseJson = null;
      //   alert(
      //     "This requests is currently over the threshold cost limit for the prototype"
      //   );
      // } else {
      //   console.log(responseJson);
      //   loading = false;
      // }
    } else {
      alert("Please select the impact areas you are interested in");
      return;
    }
  }
</script>

<div>
  <button
    type="button"
    title="Calculate impact of new scheme on impact areas"
    disabled={$gjScheme.features.length == 0 || loading}
    on:click={recalculate}
    >Calculate impact
  </button>
  {#if loading}
    <div class="ring-loader">
      <RingLoader size="25" color="#FF3E00" unit="px" duration="2s"/>
    </div>
    <p>
      Calculating... ~40seconds
    </p>
  {/if}
</div>

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
    transition: background-color 0.05s ease-in-out;
    font-size: 1rem;
    float: left;
  }
  button:hover {
    background: #005a31;
  }
  .ring-loader {
    float:left;
    margin-left: 10px;
    margin-top: 5px;
  }
  p {
    font-size: 1rem;
    float:left;
    margin-left: 8px;
    margin-top: 7px;
  }
</style>
