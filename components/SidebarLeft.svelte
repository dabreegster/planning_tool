<script>
  import EntireScheme from "./sidebarLeftComponents/EntireScheme.svelte";
  import InterventionList from "./sidebarLeftComponents/InterventionList.svelte";
  import InterventionScoreLegend from "./sidebarLeftComponents/InterventionScoreLegend.svelte";
  import CsvUpload from "./sidebarLeftComponents/CsvUpload.svelte";
  import CsvDownload from "./sidebarLeftComponents/CsvDownload.svelte";
  import Results from "./sidebarLeftComponents/Results.svelte";

  export let responseJson;
  export let hoveredInterventionScores;
  export let leftSidebarClassToggle = "blank";
  export let login_username;
  export let innerWidth;
  export let loading;
  export let exploreSidebarClassToggle = "blank";

  function getSidebarClass() {
    if (leftSidebarClassToggle == "blank") {
      exploreSidebarClassToggle = "blank";
      leftSidebarClassToggle = "sidebar"
      return "sidebar";
    } else {
      leftSidebarClassToggle = "blank";
      return "blank";
    }
  }
</script>

<button
  class="govuk-button govuk-button--start"
  data-module="govuk-button"
  style="  z-index: 1; position: absolute; top: 25px; left: 300px;"
  on:click={getSidebarClass}
  >Add Scheme
  <svg
    class="govuk-button__start-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="17.5"
    height="19"
    viewBox="0 0 33 40"
    aria-hidden="true"
    focusable="false"
  >
    <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
  </svg>
</button>

<!-- TODO fix this budget fix-->
<div class={leftSidebarClassToggle} style="height: 90px; top: 5px;">
  <br />
</div>

<div
  class={leftSidebarClassToggle}
  style="height: calc(100% - 115px); top: 73px;"
>
  <CsvUpload {innerWidth} />
  <br />
  <EntireScheme {innerWidth} />
  <br />
  <InterventionList />
  <br />
  <Results bind:responseJson bind:loading {login_username} />
  <br />
  <CsvDownload {responseJson} />
  <br />
  <InterventionScoreLegend {hoveredInterventionScores} {responseJson} />
</div>

<style>
  .sidebar {
    background-color: white;
    position: absolute;
    width: 25%;
    /* height: calc(100% - 45px); */
    padding: 20px;
    border-radius: 10px;
    left: 15px;
    /* top: 5px; */
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    scrollbar-width: none;
  }

  .blank {
    display: none;
  }
</style>
