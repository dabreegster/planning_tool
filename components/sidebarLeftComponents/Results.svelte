<script>
  import Spinner from "svelte-spinner";
  import DebugApi from "./DebugApi.svelte";
  import { gjScheme } from "../../stores.js";
  import { geojsonToApiPayload, callApi } from "../../api.js";

  let requestJson;
  export let responseJson;
  export let login_username;
  export let estimatedCostOfProcess;
  export let areaChanges;
  let area_level = null;
  let area_levels = null;

  /// todo: drop the print statements below once it works 100%
  /// at time of writing (18th Jan, adam), api returns (if upload is included):
  /// "unexpected character at line 1 column 1 of the JSON data"
  // might be a stray character
  export let loading = false;
  async function recalculate() {
    responseJson = null;
    area_level = null;
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
      estimatedCostOfProcess = responseJson.estimated_cost_of_process;
      areaChanges = convertAreaScoresToDictionary(responseJson);
      area_levels = Object.keys(areaChanges);
      area_level = "Overall: England/Wales";
      loading = false;
    }
  }

  // TODO add custom area to function
  function convertAreaScoresToDictionary(responseJson) {
    // convert to old format used below
    let areaChanges = {};

    let areaLevels = ["EW", "RGN11NM", "CAUTH21NM", "LAD11NM", "selected_area"];
    let areaAbbrs = ["Overall", "RGN", "CA", "LA", "Custom Area"];
    let scoreKeys = [
      "Business",
      "Education",
      "Entertain / public activity",
      "Shopping",
      "Visit friends at private home",
      "Overall",
    ];

    for (let i = 0; i < areaLevels.length; i++) {
      let areaLevel = areaLevels[i];
      let areaAbbr = areaAbbrs[i];
      let areaLevelDict = responseJson["results_table"][areaLevel];

      if (areaLevelDict) {
        for (let key in areaLevelDict[areaLevel]) {
          let areaScores = {};
          if (areaLevelDict[areaLevel][key] === null) {
            continue;
          } else {
            for (let j = 0; j < scoreKeys.length; j++) {
              let scoreKey = scoreKeys[j];
              areaScores[scoreKey] = areaLevelDict[scoreKey][key];
            }
            if (areaLevelDict[areaLevel][key] == "EW") {
              areaChanges[areaAbbr + ": " + "England/Wales"] = areaScores;
            } else {
              areaChanges[areaAbbr + ": " + areaLevelDict[areaLevel][key]] =
                areaScores;
            }
          }
        }
      } else {
      }
    }
    return areaChanges;
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

<br />
{#if responseJson}
  <div class="govuk-form-group">
    <label class="govuk-label" for="area-level"> Select area level </label>
    <select
      class="govuk-select"
      id="area-level"
      name="area-level"
      bind:value={area_level}
      disabled={requestJson == null}
    >
      {#if responseJson}
        {#each area_levels as level}
          <option value={level}>{level}</option>
        {/each}
      {/if}
    </select>
  </div>
{/if}

{#if responseJson}
  <table class="govuk-table">
    <!-- <caption class="govuk-table__caption">Purpose and percentage change</caption> -->
    <thead class="govuk-table__head">
      <tr class="govuk-table__row">
        <th scope="col" class="govuk-table__header">Purpose</th>
        <th scope="col" class="govuk-table__header">Area basis point change</th>
      </tr>
    </thead>
    <tbody class="govuk-table__body">
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__cell">Buisness</th>
        <td class="govuk-table__cell"
          >{areaChanges[area_level]["Business"].toFixed(6)}</td
        >
      </tr>
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__cell">Education</th>
        <td class="govuk-table__cell"
          >{areaChanges[area_level]["Education"].toFixed(6)}</td
        >
      </tr>
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__cell"
          >Entertainment / Public Activity</th
        >
        <td class="govuk-table__cell"
          >{areaChanges[area_level]["Entertain / public activity"].toFixed(
            6
          )}</td
        >
      </tr>
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__cell">Shopping</th>
        <td class="govuk-table__cell"
          >{areaChanges[area_level]["Shopping"].toFixed(6)}</td
        >
      </tr>
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__cell">Residential</th>
        <td class="govuk-table__cell"
          >{areaChanges[area_level]["Visit friends at private home"].toFixed(
            6
          )}</td
        >
      </tr>
      <tr class="govuk-table__row">
        <th scope="row" class="govuk-table__cell">Overall</th>
        <td class="govuk-table__cell"
          >{areaChanges[area_level]["Overall"].toFixed(6)}</td
        >
      </tr>
    </tbody>
  </table>
{/if}
