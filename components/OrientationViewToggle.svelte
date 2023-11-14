<script>
  import { getContext } from "svelte";

  const { getMap } = getContext("map");
  const map = getMap();

  let rotationToggle;

  function disableRotation() {
    // disable map rotation using right click + drag
    map.dragRotate.disable();
    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();
    map.setBearing(0); // Set bearing to north
    map.setPitch(0); // Set pitch to 0 (top-down view)
  }
  function enableRotation() {
    // Enable map rotation using right click + drag
    map.dragRotate.enable();
    // Enable map rotation using touch rotation gesture
    map.touchZoomRotate.enableRotation();
  }

  $: {
    if (rotationToggle) {
      enableRotation();
    } else {
      disableRotation();
    }
  }
</script>

<div class="govuk-label" style="font-size: 0.9rem;">
  Right click rotate map on/off:
  <input type="checkbox" bind:checked={rotationToggle} />
</div>

<style>
</style>
