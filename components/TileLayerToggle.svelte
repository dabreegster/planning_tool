<script>

  export let LASelected;

  // TODO remove this after sorted LA
  $:{
    if (tileSettings["level"] != "Local authority") {
      LASelected = "Hide"
    }
  }

  function modes() {
    return [
      "Overall",
      "Public transport",
      "Walking",
      "Cycling",
      "Driving",
    ]
  }

  function purposes() {
    return [
      "Overall",
      "Business",
      "Education",
      "Entertainment",
      // "Health",
      "Shopping",
      "Residential",
    ]
  }
  function tileLevels() {
    return [
      "National",
      "Local authority",
    ]
  }

  export let tileSettings = {
    toggle: true,
    level: "National",
    mode: "Overall",
    purpose: "Overall",
  };
</script>

<div class="govuk-label" style="font-size: 1rem;">
  Toggle tile layer:
  <input type="checkbox" 
  bind:checked={tileSettings["toggle"]} 
/>
</div>
<div class="govuk-form-group" style="display: flex;">
  <div
    class="govuk-label"
    style="margin-right: 10px; margin-top: 5px; font-size: 1rem;"
  >
    Level:
  </div>
  <select
    class="govuk-select"
    bind:value={tileSettings["level"]}
  >
    {#each tileLevels() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>
<div class="govuk-form-group" style="display: flex;">
  <div
    class="govuk-label"
    style="margin-right: 10px; margin-top: 5px; font-size: 1rem;"
  >    
    Purpose:
  </div>
  <select
    class="govuk-select"
    bind:value={tileSettings["purpose"]}
  >
    {#each purposes() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>
<div class="govuk-form-group" style="display: flex;">
  <div
    class="govuk-label"
    style="margin-right: 10px; margin-top: 5px; font-size: 1rem;"
  >
    Mode:
  </div>
  <select
    class="govuk-select"
    bind:value={tileSettings["mode"]}
    >
    {#each modes() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<!-- 
<div class="govuk-form-group" style="display: flex;">
  <label class="govuk-label" for="tileScoreLayer" style="font-size: 1rem;">
    Tile layer score purpose:
  </label>
  <select
    class="govuk-select"
    id="tileScoreLayer"
    name="tileScoreLayer"
    bind:value={tileScoreLayer}
  >
    {#each scoreTypes() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div> -->

<style>
  select {
    padding: 4px 8px;
    font-size: 0.9rem;
    height: 35px;
    float: right;
    border: 1px solid rgb(0, 0, 0);
  }
</style>
