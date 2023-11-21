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
  import CurrentInterventionLayerToggle from "./CurrentInterventionLayerToggle.svelte";
  import Accordion from "./Accordion.svelte";
  // import AddScheme from "./AddScheme.svelte";

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
  export let scoreLayer;
  export let line_toggle = "new_pt_route";
  export let stopLayerToggle;
</script>

<div class="whitebox">
  <AccordionWithTwoHeaders {pixelReduction} bind:open>
    <div slot="headLeft" class="header">Explore Scores</div>
    <div slot="details">
      Coming soon
      <!-- <PurposeWeightSliders bind:weights {squareScores} />
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
      /> -->
    </div>
    <div slot="headRight" class="header">New Scheme</div>
    <div slot="details2">
      <CsvUpload {innerWidth} />
      <br />
      <EntireScheme {innerWidth} />
      <!-- <Accordion>
        <span slot="head" class="header" title="Add new public transport route"
          >Add route
        </span>
        <div slot="details">
          <AddScheme bind:stopLayerToggle bind:drawing bind:line_toggle />
        </div>
      </Accordion> -->
      <br />
      <InterventionList />
      <br />
      <Results bind:responseJson bind:loading {login_username} />
      <br />
      <!-- <CsvDownload {responseJson} /> -->
      <br />
      <CurrentInterventionLayerToggle {responseJson} bind:scoreLayer />
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
    background: rgba(255, 255, 255, 0.7);
    padding: 0 15px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    /* width: 25%; */
    width: 520px;
  }
</style>
