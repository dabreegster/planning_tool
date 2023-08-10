<script>
  import Accordion from "./Accordion.svelte";
  import TileLayer from "./TileLayer.svelte";
  import PdfDownload from "./PdfDownload.svelte";
  import ApgbLayer from "./APGBLayer.svelte";
  import LoadGeojson from "./LoadGeojson.svelte";
  // import OpacitySlider from "./OpacitySlider.svelte";

  let tileOpacity;
  let squareID;
  let drawing;
  let hoverInfo;

</script>

<div class="whitebox">
  <Accordion>
    <span slot="head" class="header">Settings</span>
    <div slot="details">
      <TileLayer {tileOpacity} />
      <ApgbLayer />
      <!-- <LoadGeojson {drawing} bind:squareID bind:hoverInfo /> -->
      <PdfDownload {squareID} />
      <p>
      </p>
    </div>
  </Accordion>
</div>


<style>
   .whitebox {
    position: absolute;
    top: 600px;
    right: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    width: 450px;
  }
  .header {
    font-size: 1.1rem;

  }
</style>
