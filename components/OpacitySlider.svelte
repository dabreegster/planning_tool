<script>
  import Slider from "@bulatdashiev/svelte-slider";

  export let tileOpacity = [50];
</script>

<div class="whitebox">
  <h3>
    Tile opacity: {tileOpacity} %
  </h3>
  <Slider bind:value={tileOpacity} />
</div>

<style>
  h3 {
    text-align: center;
    font-size: 1.2rem;
  }
  /* .whitebox {
    background-color: white;
    position: absolute;
    width: 377px;
    padding: 16px;
    border-radius: 10px;
    right: 10px;
    top: 110px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    scrollbar-width: none;
  } */
</style>
