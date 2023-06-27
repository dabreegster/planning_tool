<script>
  let colour = "#0062ff";
  function addOpacity(colour) {
    let colours = [];
    for (var i = 10; i <= 80; i++) {
      let opacity = 0.01 * i;
      var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
      colours.push(colour + _opacity.toString(16).toUpperCase());
    }
    return colours;
  }
  let colours = addOpacity(colour);

  let thresholds = [];
  let results_table = null;

  export let hoveredInterventionScores;
  export let responseJson;

  // TODO import findThresholds function from CurrentInterventionLayer.svelte
  function findThresholds(responseJson) {
    let results_table = null;
    results_table = responseJson.tile_diff_scores;
    let maxValue = 0;
    for (const key in results_table) {
      // TODO: change backend to rename return square_ID instead of lsoa_name
      if (key == "lsoa_name") {
      } else {
        const values = Object.values(results_table[key]);
        for (const value of values) {
          if (value > maxValue) {
            maxValue = value;
          }
        }
      }
    }
    let thresholds = [];
    for (let i = 0; i <= 9; i++) {
      thresholds.push(i * 0.1 * maxValue);
    }
    return thresholds;
  }
</script>

<div class="legend">
  {#if responseJson}
    {#each colours as colour}
      <div class="square" style="background-color: {colour}" />
    {/each}
  {/if}
</div>

<div class="legend">
  {#if responseJson}
    {#each findThresholds(responseJson) as number}
      <div class="numbers">
        {number}
      </div>
    {/each}
  {/if}
</div>

<br />

{#if responseJson}
  <table class="govuk-table">
    <caption class="govuk-table__caption govuk-table__caption--m"
      >Intervention Impact</caption
    >
    <thead class="govuk-table__head">
      <tr class="govuk-table__row">
        <th scope="col" class="govuk-table__header">Purpose</th>
        <th scope="col" class="govuk-table__header">Basis point change</th>
      </tr>
    </thead>
    <tbody class="govuk-table__body">
      {#if hoveredInterventionScores}
        {#each Object.entries(hoveredInterventionScores) as [key, value]}
          {#if key != "OA"}
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">{key}</td>
              <td class="govuk-table__cell">{value.toFixed(4)}</td>
            </tr>
          {:else}
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>{value}</strong></td>
              <td class="govuk-table__cell" />
            </tr>
          {/if}
        {/each}
      {:else}
        <tr class="govuk-table__row">
          <td class="govuk-table__cell" colspan="2"
            >Hover on an OA to see intervention impact</td
          >
        </tr>
      {/if}
    </tbody>
  </table>
{/if}

<div class="space" />

<style>
  .legend {
    display: flex;
  }

  .square {
    width: 10.8px;
    height: 50px;
  }

  .numbers {
    width: 36.5px;
    height: 10px;
    color: black;
  }

  .space {
    margin-top: 350px;
  }
</style>
