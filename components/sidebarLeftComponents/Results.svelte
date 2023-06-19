<script>
  import Spinner from "svelte-spinner";
  import DebugApi from "./DebugApi.svelte";
  import { gjScheme } from "../../stores.js";
  import { geojsonToApiPayload, callApi } from "../../api.js";

  let requestJson;
  export let responseJson;
  export let login_username;
  // export let estimatedCostOfProcess;

  export let loading = false;
  async function recalculate() {
    responseJson = null;
    loading = true;
    requestJson = await geojsonToApiPayload($gjScheme.features, login_username);
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
      // estimatedCostOfProcess = responseJson.estimated_cost_of_process;
      loading = false;
    }
  }
</script>

<button
  type="button"
  class="govuk-button"
  data-module="govuk-button"
  disabled={$gjScheme.features.length == 0 || loading}
  style="font-size: 1rem"
  on:click={recalculate}
  >Recalculate scores
</button>

{#if loading}
  <Spinner class="spinner" />
{/if}

<DebugApi {requestJson} {responseJson} />
