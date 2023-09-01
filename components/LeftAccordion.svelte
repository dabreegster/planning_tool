<script>
  import AccordionWithTwoHeaders from "./AccordionWithTwoHeaders.svelte";
  import HoverScores from "./HoverScores.svelte";
  import PurposeWeightSliders from "./PurposeWeightSliders.svelte";
  import DisplayWeightedGeojsons from "./DisplayWeightedGeojsons.svelte";
  import EntireScheme from "./sidebarLeftComponents/EntireScheme.svelte";
  import InterventionList from "./sidebarLeftComponents/InterventionList.svelte";
  import InterventionScoreLegend from "./sidebarLeftComponents/InterventionScoreLegend.svelte";
  import CsvUpload from "./sidebarLeftComponents/CsvUpload.svelte";
  import CsvDownload from "./sidebarLeftComponents/CsvDownload.svelte";
  import Results from "./sidebarLeftComponents/Results.svelte";

  let weights;
  let squareScores;
  let mode;
  let squaresFound;
  export let open;
  export let tileOpacity;
  export let responseJson;
  export let hoveredInterventionScores;
  export let login_username;
  export let innerWidth;
  export let loading;
  export let pixelReduction = 90;

  $: {
    console.log(open);
  }
</script>

<div class="whitebox">
  <AccordionWithTwoHeaders {pixelReduction} bind:open>
    <div slot="headLeft" class="header">Explore Scores</div>
    <div slot="details">
      <PurposeWeightSliders bind:weights {squareScores} />
      <br />
      <HoverScores
        {weights}
        {open}
        bind:squareScores
        bind:mode
        bind:squaresFound
      />
      <DisplayWeightedGeojsons
        {weights}
        {squareScores}
        {mode}
        {squaresFound}
        {tileOpacity}
      />
    </div>
    <div slot="headRight" class="header">Add Scheme</div>
    <div slot="details2">
      <CsvUpload {innerWidth} />
      <br />
      <EntireScheme {innerWidth} />
      <br />
      <InterventionList />
      <br />
      <Results bind:responseJson bind:loading {login_username} />
      <br />
      <!-- <CsvDownload {responseJson} /> -->
      <br />
      <!-- <InterventionScoreLegend {hoveredInterventionScores} {responseJson} /> -->
    </div>
  </AccordionWithTwoHeaders>
</div>

<style>
  .whitebox {
    position: absolute;
    top: 5px;
    left: 10px;
    background: white;
    padding: 0 15px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    width: 25%;
  }
  .header {
    font-size: 1.2rem;
  }
</style>
