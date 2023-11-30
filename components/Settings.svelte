<script>
  import Accordion from "./Accordion.svelte";
  import TileLayerToggle from "./TileLayerToggle.svelte";
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
  import OrientationViewToggle from "./OrientationViewToggle.svelte";

  export let tileOpacity;
  export let infoForPDF;
  export let purpose;
  export let startTimeSeconds = 28800;
  export let stopStatuses;
  export let stopCheckboxClicked;
  export let pixelReduction = 300;
  export let toggleDisplayeRouteOnClick;
  export let tileSettings;
</script>

<div class="whitebox">
  <ScoreLegend {tileOpacity} {infoForPDF} {tileSettings} />
  <br />
  <div class="greybox">
    <SnapToPostcode />
  </div>
  <AccordionWithTwoHeaders {pixelReduction}>
    <div slot="headLeft" class="header">Coordinate search</div>
    <div slot="details">
      <SnapToLongLat />
      <br />
      <SnapToEastingNorthing />
    </div>
    <div slot="headRight" class="header">Settings</div>
    <div slot="details2">
      <Accordion>
        <span slot="head" class="header">Tile settings</span>
        <div slot="details">
          <OpacitySlider bind:tileOpacity />
          <br />
          <TileLayerToggle bind:tileSettings />
        </div>
      </Accordion>
      <Accordion>
        <span slot="head" class="header">Displayed route settings</span>
        <div slot="details">
          <DisplayedRouteSettings
            bind:purpose
            bind:startTimeSeconds
            bind:toggleDisplayeRouteOnClick
          />
          <PdfDownload {infoForPDF} />
        </div>
      </Accordion>
      <Accordion>
        <span slot="head" class="header">Base map settings</span>
        <div slot="details">
          <ApgbLayer />
          <OrientationViewToggle />
        </div>
      </Accordion>
      <br />
      <StopsLayerToggles bind:stopStatuses bind:stopCheckboxClicked />
    </div>
  </AccordionWithTwoHeaders>
</div>

<style>
  .whitebox {
    position: absolute;
    top: 5px;
    right: 10px;
    background: rgba(255, 255, 255, 0.7);
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
</style>
