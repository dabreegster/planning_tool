<script>

  export let tileScoreLayer = "Overall Connectivity";

  function scoreTypes() {
    let purposes = [
      "Hide",
      "Overall Connectivity",

      "Business by PT",
      "Education by PT",
      "Entertainment by PT",
      "Shopping by PT",
      "Residential by PT",

      "Business by walking",
      "Education by walking",
      "Entertainment by walking",
      "Health by walking",
      "Shopping by walking",
      "Residential by walking",

      "Business by driving",
      "Education by driving",
      "Entertainment by driving",
      "Health by driving",
      "Shopping by driving",
      "Residential by driving",

      "Business by cycling",
      "Education by cycling",
      "Entertainment by cycling",
      "Health by cycling",
      "Shopping by cycling",
      "Residential by cycling",
      // "Overall"
    ];
    return purposes;
  }
</script>

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
</div>

<style>
  select {
    padding: 4px 8px;
    font-size: 0.9rem;
    height: 35px;
    float: right;
    border: 1px solid rgb(0, 0, 0);
  }
</style>
