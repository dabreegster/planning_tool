<script>
  export let responseJson;
  export let areaChanges;

  function downloadResultsTable(responseJson) {
    let table = responseJson["results_table"]["OA11CD"];
    let keys = Object.keys(table);
    let keysCommaReplaced = keys.map((item) => {
      const parts = item.split(", ");
      return parts.length > 1 ? `${parts[0]} (${parts[1]})` : item;
    });
    let rows = Object.keys(table[keys[0]]);
    keysCommaReplaced = ["OA11CD"].concat(
      keysCommaReplaced.filter((element) => element !== "OA11CD")
    );
    let csv = keysCommaReplaced.join(",") + "\n";

    for (var i = 0; i < rows.length; i++) {
      for (var x = 0; x < keysCommaReplaced.length; x++) {
        if (x > 0) {
          csv += table[keysCommaReplaced[x]][rows[i]].toFixed(5);
        } else {
          csv += table[keysCommaReplaced[x]][rows[i]];
        }
        if (x < keysCommaReplaced.length - 1) {
          csv += ",";
        }
      }
      csv += "\n";
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "connetivity_OA_results_table.csv";
    link.click();
  }

  function downloadAreaChangesTable(areaChanges) {
    let table = areaChanges;
    console.log(`areaChanges: ${JSON.stringify(areaChanges)}`);
    let keys = Object.keys(table);
    let keysCommaReplaced = keys.map((item) => {
      const parts = item.split(", ");
      return parts.length > 1 ? `${parts[0]} (${parts[1]})` : item;
    });
    let rows = Object.keys(table[keys[0]]);
    let csv = "," + keysCommaReplaced.join(",") + "\n";

    for (var i = 0; i < rows.length; i++) {
      csv += rows[i];
      for (var x = 0; x < keys.length; x++) {
        csv += ",";
        csv += table[keys[x]][rows[i]].toFixed(6);
      }
      csv += "\n";
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "connetivity_changes_by_area.csv";
    link.click();
  }
</script>

<div>
  {#if responseJson}
    <button
      class="white_button"
      style="font-size:medium"
      on:click={() => downloadAreaChangesTable(areaChanges)}
    >
      Download area change table as CSV
    </button>
    <button
      class="white_button"
      style="font-size:medium"
      on:click={() => downloadResultsTable(responseJson)}
    >
      Download OA results as CSV
    </button>
  {/if}
</div>

<style>
  button {
    border-radius: 5px;
    transition: background-color 0.05s ease-in-out;
  }
  .white_button {
    background: white;
    padding: 10px;
    border-radius: 10px;
    font-size: 0.8rem;
    transition: background-color 0.05s ease-in-out;
  }
  .white_button:hover {
    background: #dfdfdf;
  }
</style>
