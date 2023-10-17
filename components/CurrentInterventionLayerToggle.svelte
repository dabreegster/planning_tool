<script>
  export let responseJson;

  export let scoreLayer = "Hide";

  function scoreTypes() {
    let purposes = [
      "Hide",
      "Business",
      "Education",
      "Entertainment",
      "Health",
      "Shopping",
      "Residential",
    ];
    return purposes;
  }

</script>

<div class="govuk-form-group" style="display: flex; ">
  <label
    class="govuk-label"
    for="scoreLayer"
    style="margin-right: 10px; margin-top: 8px; font-size: 1rem; opacity: {responseJson ==
    null
      ? 0.15
      : 1}"
  >
  <div style="font-size: 1rem">
    Intervention scores:
  </div>
  
  </label>
  <select
    class="govuk-select"
    id="scoreLayer"
    name="scoreLayer"
    style="opacity: {responseJson == null ? 0.15 : 1}; height: 35px;"
    bind:value={scoreLayer}
    disabled={responseJson == null}
  >
    {#each scoreTypes() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<style>
  select {
    font-size: 14px;
    padding: 4px 8px;
  }
</style>
