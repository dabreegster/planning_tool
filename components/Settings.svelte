<script>
  import Accordion from "./Accordion.svelte";
  import TileLayer from "./TileLayer.svelte";
  import PdfDownload from "./PdfDownload.svelte";
  import ApgbLayer from "./APGBLayer.svelte";
  import StopsLayer from "./StopsLayer.svelte";
  import OpacitySlider from "./OpacitySlider.svelte";
  import DisplayedRouteSettings from "./DisplayedRouteSettings.svelte";
  import SnapToPostcode from "./SnapToPostcode.svelte";
  import SnapToLongLat from "./SnapToLongLat.svelte";
  import SnapToEastingNorthing from "./SnapToEastingNorthing.svelte";
  import ScoreLegend from "./ScoreLegend.svelte";

  export let tileOpacity;
  export let infoForPDF;
  export let stopLayerToggle;
  export let purpose;
  export let startTimeSeconds = 28800;
</script>

<div class="whitebox">
  <ScoreLegend {tileOpacity} />
  <br />
  <SnapToPostcode />
  <Accordion>
    <span slot="head" class="header">Find EN/LL > </span>
    <div slot="details">
      <SnapToLongLat />
      <br />
      <SnapToEastingNorthing />
    </div>
  </Accordion>

  <Accordion>
    <span slot="head" class="header">Settings > </span>
    <div slot="details">
      <Accordion>
        <span slot="head" class="header">Route settings ></span>
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
      <StopsLayer {stopLayerToggle} />
      <p />
    </div>
  </Accordion>
</div>

<style>
  .whitebox {
    position: absolute;
    top: 5px;
    right: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    width: 530px;
  }
  .header {
    font-size: 1.2rem;
  }
</style>
