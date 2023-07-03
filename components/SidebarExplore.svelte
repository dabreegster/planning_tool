<script>
  import HoverScores from "./HoverScores.svelte";
  import PurposeWeightSliders from "./PurposeWeightSliders.svelte";
  import DisplayWeightedGeojsons from "./DisplayWeightedGeojsons.svelte";

  export let leftSidebarClassToggle = "blank";
  export let exploreSidebarClassToggle = "blank";

  let weights;
  let squareScores;
  let mode;
  let squaresFound;
  export let tileOpacity;

  function getSidebarClass() {
    if (exploreSidebarClassToggle == "blank") {
      leftSidebarClassToggle = "blank";
      exploreSidebarClassToggle = "sidebar";
      return "sidebar";
    } else {
      exploreSidebarClassToggle = "blank";
      return "blank";
    }
  }
  $: {
    getSidebarClass();
  }
</script>

<button
  class="govuk-button govuk-button--start"
  data-module="govuk-button"
  style="  z-index: 1; position: absolute; top: 25px; left: 40px;"
  on:click={getSidebarClass}
>
  Explore scores
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
<div class={exploreSidebarClassToggle} style="height: 90px; top: 5px;">
  <br />
</div>

<div
  class={exploreSidebarClassToggle}
  style="height: calc(100% - 115px); top: 73px;"
>
  <PurposeWeightSliders bind:weights {squareScores} />
  <br />
  <HoverScores {weights} bind:squareScores bind:mode bind:squaresFound />
  <DisplayWeightedGeojsons {weights} {squareScores} {mode} {squaresFound} {tileOpacity}/>
</div>

<style>
  .sidebar {
    background-color: white;
    position: absolute;
    width: 500px;
    /* height: calc(100% - 45px); */
    padding: 20px;
    border-radius: 10px;
    left: 30px;
    /* top: 5px; */
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    scrollbar-width: none;
  }

  .blank {
    display: none;
  }
</style>
