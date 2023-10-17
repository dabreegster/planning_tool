<script>
  import Accordion from "./Accordion.svelte";
  import TileLayer from "./TileLayer.svelte";
  import PdfDownload from "./PdfDownload.svelte";
  import ApgbLayer from "./APGBLayer.svelte";
  import StopsLayerToggles from "./StopsLayerToggles.svelte";
  import OpacitySlider from "./OpacitySlider.svelte";
  import DisplayedRouteSettings from "./DisplayedRouteSettings.svelte";
  import SnapToPostcode from "./SnapToPostcode.svelte";
  import SnapToLongLat from "./SnapToLongLat.svelte";
  import SnapToEastingNorthing from "./SnapToEastingNorthing.svelte";
  import ScoreLegend from "./ScoreLegend.svelte";
  import AccordionWithTwoHeaders from "./AccordionWithTwoHeaders.svelte";
  import LaLevelScoresToggle from "./LALevelScoresToggle.svelte";
  import LaLevelColourLegend from "./LALevelColourLegend.svelte";

  export let tileOpacity;
  export let infoForPDF;
  export let purpose;
  export let startTimeSeconds = 28800;
  export let stopStatuses;
  export let stopCheckboxClicked;
  export let pixelReduction = 210;
  export let LASelected;
</script>

<div class="whitebox">
  <!-- <div class="greybox"> -->
    <ScoreLegend {tileOpacity} />
  <!-- </div> -->
  <br />
  <div class="greybox">
    <SnapToPostcode />
  </div>
  <AccordionWithTwoHeaders {pixelReduction}>
    <div slot="headLeft" class="header">Move to EN/LL</div>
    <div slot="details">
      <SnapToLongLat />
      <br />
      <SnapToEastingNorthing />
      <br />
      <div class="lightgreybox">
        <LaLevelScoresToggle bind:LASelected/>
        <LaLevelColourLegend />
      </div>
    </div>
    <div slot="headRight" class="header">Settings</div>
    <div slot="details2">
      <Accordion>
        <span slot="head" class="header">Route settings</span>
        <div slot="details">
          <DisplayedRouteSettings bind:purpose bind:startTimeSeconds />
        </div>
      </Accordion>
      <OpacitySlider bind:tileOpacity />
      <br />
      <TileLayer {tileOpacity} />
      <ApgbLayer />
      <PdfDownload {infoForPDF} />
      <br />
      <StopsLayerToggles bind:stopStatuses={stopStatuses} bind:stopCheckboxClicked />
    </div>
  </AccordionWithTwoHeaders>
  <!-- <Accordion>
    <span slot="head" class="header">Find EN/LL </span>
    <div slot="details">
      <SnapToLongLat />
      <br />
      <SnapToEastingNorthing />
    </div>
  </Accordion>

  <Accordion>
    <span slot="head" class="header">Settings </span>
    <div slot="details">
      <Accordion>
        <span slot="head" class="header">Route settings</span>
        <div slot="details">
          <DisplayedRouteSettings bind:purpose bind:startTimeSeconds />
        </div>
      </Accordion>
      <OpacitySlider bind:tileOpacity />
      <br />
      <TileLayer {tileOpacity} />
      <ApgbLayer />
      <PdfDownload {infoForPDF} />
      <br />
      <StopsLayerToggles bind:stopStatuses={stopStatuses} bind:stopCheckboxClicked />
    </div>
  </Accordion> -->

</div>

<style>
  .whitebox {
    position: absolute;
    top: 5px;
    right: 10px;
    background:rgba(255, 255, 255, 0.7);
    padding: 10px 15px 0 15px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    width: 400px;
  }
  .header {
    font-size: 1rem;
  }
  .greybox {
    background: #f0f0f0;
    /* background: white; */
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
  .lightgreybox {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1rem;
    margin-top: 10px;
  }
</style>
