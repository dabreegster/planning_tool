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
    Intervention scores:
  </label>
  <select
    class="govuk-select"
    id="scoreLayer"
    name="scoreLayer"
    style="opacity: {responseJson == null ? 0.15 : 1}"
    bind:value={scoreLayer}
    disabled={responseJson == null}
  >
    {#each scoreTypes() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<style>
  div {
  }

  select {
    font-size: 16px;
    padding: 4px 8px;
  }
</style>
