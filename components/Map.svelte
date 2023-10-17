<script>
  import { onMount, onDestroy, setContext } from "svelte";
  import {
    Map,
    NavigationControl,
    ScaleControl,
    addProtocol,
  } from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import * as pmtiles from "pmtiles";

  let protocol = new pmtiles.Protocol();
  addProtocol("pmtiles", protocol.tile);

  export let innerHeight;

  let map;
  let mapContainer;
  let loaded = false;

  // TODO Supposed to use a phantom type, not a string, as the key
  setContext("map", { getMap: () => map });

  onMount(() => {
    // Before creating the map, check if there's a hash, because one will get set below
    let setCamera = !window.location.hash;

    map = new Map({
      container: mapContainer,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=KhrJl1uDAOHLgJ4c6Px9",
      hash: true,
    });
    map.addControl(new ScaleControl());
    map.addControl(new NavigationControl(), "bottom-right");

    if (setCamera) {
      map.jumpTo({
        center: [-0.47, 52.879],
        zoom: 6,
      });
    }

    map.on("load", () => {
      loaded = true;
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainer);
  });

  onDestroy(() => {
    map.remove();
  });
</script>

<div style="height: {innerHeight - 96}px" bind:this={mapContainer}>
  {#if loaded}
    <slot />
  {/if}
</div>

<style>
  :global(.mapboxgl-ctrl-group > button) {
    width: 50px;
    height: 50px;
  }
</style>
