<script>
  import Accordion from "./Accordion.svelte";
  import TileLayer from "./TileLayer.svelte";
  import PdfDownload from "./PdfDownload.svelte";
  import ApgbLayer from "./APGBLayer.svelte";
  import StopsLayer from "./StopsLayer.svelte";
  import OpacitySlider from "./OpacitySlider.svelte";
  import DisplayedRouteSettings from "./DisplayedRouteSettings.svelte";


  export let tileOpacity;
  export let squareID;
  export let stopLayerToggle;
  export let purpose;
  export let startTimeSeconds = 28800;


</script>

<div class="whitebox">
  <Accordion>
    <span slot="head" class="header">Settings > </span>
    <div slot="details">
      <Accordion>
        <span slot="head" class="header">Route settings ></span>
        <div slot="details">
          <DisplayedRouteSettings bind:purpose bind:startTimeSeconds/>
        </div>
      </Accordion>
      <OpacitySlider bind:tileOpacity />
      <br/>
      <TileLayer {tileOpacity} />
      <ApgbLayer />
      <PdfDownload {squareID} />
      <br/>
      <StopsLayer {stopLayerToggle} />
      <p>
      </p>
    </div>
  </Accordion>
</div>


<style>
   .whitebox {
    position: absolute;
    top: 280px;
    right: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    width: 450px;
  }
  .header {
    font-size: 1.2rem;

  }
</style>
