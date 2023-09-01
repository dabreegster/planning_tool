<script>
  import { NumberInput, TextInput, DataTable } from "carbon-components-svelte";
  export let props;

  let rows = [];
  $: {
    rows = [];
    for (let i = 0; i < props.ATCO.length; i++) {
      rows.push({
        id: props.ATCO[i],
        arrivalTime: props.arrivalTime[i],
        departureTime: props.departureTime[i],
      });
    }
  }

  let headers = [
    { key: "id", value: "Stop ATCO" },
    { key: "arrivalTime", value: "Arrival time" },
    { key: "departureTime", value: "Departure time" },
  ];

  function updateArrivalTime(e, row) {
    let indexToChange = props.ATCO.indexOf(row["id"]);
    // TODO add check that arrival time is after departure time of last stop
    props.arrivalTime[indexToChange] = e.target.value;
  }
  function updateDepartureTime(e, row) {
    let indexToChange = props.ATCO.indexOf(row["id"]);
    props.departureTime[indexToChange] = e.target.value;
  }
  function currentArrivalTime(row) {
    let currentIndex = props.ATCO.indexOf(row["id"]);
    return props.arrivalTime[currentIndex];
  }
  function currentDepartureTime(row) {
    let currentIndex = props.ATCO.indexOf(row["id"]);
    return props.departureTime[currentIndex];
  }
</script>

Route name
<TextInput bind:value={props.name} style="font-size: 16px; background-color: white; border: 1px solid black;" />
<br />

Number of services on route
<NumberInput hideSteppers bind:value={props.dailyTrips} style="font-size: 16px; background-color: white; border: 1px solid black;" />

<br />
Time between services (minutes)
<NumberInput hideSteppers style="font-size: 16px; background-color: white; border: 1px solid black;" bind:value={props.frequency} />

<br />
First service timetable
<DataTable bind:rows {headers}>
  <svelte:fragment slot="cell" let:cell let:row>
    {#if cell.key == "departureTime" && row.departureTime != "Last stop"}
      <input
        type="time"
        step="2"
        value={currentDepartureTime(row)}
        on:change={(e) => updateDepartureTime(e, row)}
        style="font-size: 16px; padding:5px"
      />
    {:else if cell.key == "arrivalTime" && row.arrivalTime != "First stop"}
      <input
        type="time"
        step="2"
        value={currentArrivalTime(row)}
        on:change={(e) => updateArrivalTime(e, row)}
        style="font-size: 16px; padding:5px"
      />
    {:else}
      {cell.value}
    {/if}
  </svelte:fragment>
</DataTable>

<!-- <pre>
{JSON.stringify(props, null, 2)}
</pre> -->
