<script>
  export let stopStatuses = {
    show: [false, false, false, false, false],
    switchStatus: [true, true, true, true, true],
  };
  export let stopCheckboxClicked = [true, 0];

  function toggleStopCheckboxClicked(index) {
    stopCheckboxClicked[1] = index;
    if (stopCheckboxClicked[0]) {
      stopCheckboxClicked[0] = false;
    } else {
      stopCheckboxClicked[0] = true;
    }
  }
</script>

<div class="govuk-label govuk-text--s" style="font-size: 1.1rem;">
  Bus/Coach stops:<input
    type="checkbox"
    bind:checked={stopStatuses["show"][0]}
    on:change={() => toggleStopCheckboxClicked(0)}
  />
  <br />
  National Rail stops:<input
    type="checkbox"
    bind:checked={stopStatuses["show"][1]}
    on:change={() => toggleStopCheckboxClicked(1)}
  />
  <br />
  Tube/Metro/LightRail stops:<input
    type="checkbox"
    bind:checked={stopStatuses["show"][2]}
    on:change={() => toggleStopCheckboxClicked(2)}
  />
  <br />
  Tram stops:<input
    type="checkbox"
    bind:checked={stopStatuses["show"][3]}
    on:change={() => toggleStopCheckboxClicked(3)}
  />
  <br />
  Ferry stops:<input
    type="checkbox"
    bind:checked={stopStatuses["show"][4]}
    on:change={() => toggleStopCheckboxClicked(4)}
  />
</div>

<style>
</style>
