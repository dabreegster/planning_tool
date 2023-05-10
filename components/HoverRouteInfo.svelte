<script>
  export let hoverInfo = "no_selection";
  let displayToggle = "hoverOff";

  function toggleDisplay(hoverInfo) {
    if (hoverInfo == "no_selection") {
      displayToggle = "hoverOff";
    } else {
      displayToggle = "hoverOn";
    }
  }

  function infoBoxLocation(hoverInfo, axis) {
    if (hoverInfo == "no_selection") {
    } else {
      if (axis == "x") {
        return hoverInfo.cursorxy.x;
      } else {
        return hoverInfo.cursorxy.y;
      }
    }
  }

  $: {
    toggleDisplay(hoverInfo);
  }
</script>

<div
  class={displayToggle}
  style="left: {infoBoxLocation(hoverInfo, 'x')}px; top: {infoBoxLocation(
    hoverInfo,
    'y'
  )}px;"
>
  {#if hoverInfo != "no_selection"}
    <b style="font-weight: bold">{hoverInfo.routeDetails.vehicle_mode}</b>
    <br>
    Route: {hoverInfo.routeDetails.route_number}
    <br>
    From: {hoverInfo.routeDetails.origin_stop_name}
    <br>
    To: {hoverInfo.routeDetails.destination_stop_name}
  {:else if hoverInfo == "no_selection"}
    <p class="govuk-body">Hover to see route info</p>
  {/if}
</div>

<style>
  .hoverOn {
    background-color: white;
    position: fixed;
    /* width: 300px; */
    /* height: 100px; */
    padding: 16px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    scrollbar-width: none;
    opacity: 0.85;
    font-size: 1rem;
  }

  .hoverOff {
    display: none;
  }
</style>
