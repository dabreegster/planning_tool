<script>
  import { NumberInput, TextInput, DataTable } from "carbon-components-svelte";
  export let props;

  let headers = [
    { key: "stopNumber", value: "Stop" },
    { key: "id", value: "ATCO" },
    { key: "arrivalTime", value: "Arrival time" },
    { key: "departureTime", value: "Departure time" },
  ];

  let rows = [];
  $: {
    rows = [];
    for (let i = 0; i < props.ATCO.length; i++) {
      rows.push({
        stopNumber: i+1,
        // TODO fix this hack of adding spaces after to make sure no duplicate ATCO codes
        // potentially add stop names?
        id: props.ATCO[i] + ' '.repeat(i),
        arrivalTime: props.arrivalTime[i],
        departureTime: props.departureTime[i],
      });
    }
  }

  export function updateArrivalTime(e, row) {
    let indexToChange = row["stopNumber"]-1;
    // TODO add check that arrival time is after departure time of last stop
    props.arrivalTime[indexToChange] = e.target.value;
  }
  export function updateDepartureTime(e, row) {
    let indexToChange = row["stopNumber"]-1;
    props.departureTime[indexToChange] = e.target.value;
  }
  export function currentArrivalTime(row) {
    let currentIndex = row["stopNumber"]-1;
    return props.arrivalTime[currentIndex];
  }
  export function currentDepartureTime(row) {
    let currentIndex = row["stopNumber"]-1;
    return props.departureTime[currentIndex];
  }

</script>

<div style="font-size: 0.9rem">Route name:</div>
<TextInput
  bind:value={props.name}
  style="font-size: 14px; background-color: white; border: 1px solid black; height: 30px;"
/>
<br />

<div style="font-size: 0.9rem">Number of services on route per day:</div>
<NumberInput
  hideSteppers
  bind:value={props.dailyTrips}
  style="font-size: 14px; background-color: white; border: 1px solid black; height: 30px;"
/>

<br />
<div style="font-size: 0.9rem">Time between each of these services (minutes):</div>
<NumberInput
  hideSteppers
  style="font-size: 14px; background-color: white; border: 1px solid black; height: 30px;"
  bind:value={props.frequency}
/>

<br />
<div style="font-size: 0.9rem">First service timetable:</div>
<DataTable bind:rows {headers}>
  <svelte:fragment slot="cell" let:cell let:row>
    {#if cell.key == "departureTime" && row.departureTime != "Last stop"}
      <input
        type="time"
        step="2"
        value={currentDepartureTime(row)}
        on:change={(e) => updateDepartureTime(e, row)}
        style="font-size: 13px; padding:5px"
      />
    {:else if cell.key == "arrivalTime" && row.arrivalTime != "First stop"}
      <input
        type="time"
        step="2"
        value={currentArrivalTime(row)}
        on:change={(e) => updateArrivalTime(e, row)}
        style="font-size: 13px; padding:5px"
      />
    {:else}
      {cell.value}
    {/if}
  </svelte:fragment>
</DataTable>
<!-- <DataTable bind:rows {headers}>
  <svelte:fragment slot="cell" let:cell let:row>
    {#if cell.key == "departureTime" && row.departureTime != "Last stop"}
      <input
        type="time"
        step="2"
        value={currentDepartureTime(row)}
        on:change={(e) => updateDepartureTime(e, row)}
        style="font-size: 13px; padding:5px"
      />
    {:else if cell.key == "arrivalTime" && row.arrivalTime != "First stop"}
      <input
        type="time"
        step="2"
        value={currentArrivalTime(row)}
        on:change={(e) => updateArrivalTime(e, row)}
        style="font-size: 13px; padding:5px"
      />
    {:else}
      {cell.value}
    {/if}
  </svelte:fragment>
</DataTable> -->

<!-- <pre>
{JSON.stringify(props, null, 2)}
</pre> -->
