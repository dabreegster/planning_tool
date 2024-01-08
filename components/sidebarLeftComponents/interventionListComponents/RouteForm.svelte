<script>
  import { TextInput, DataTable } from "carbon-components-svelte";
  import { callAutofillBus } from "../../../api.js";
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
        stopNumber: i + 1,
        // TODO fix this hack of adding spaces after to make sure no duplicate ATCO codes
        // potentially add stop names?
        id: props.ATCO[i] + " ".repeat(i),
        arrivalTime: props.arrivalTime[i],
        departureTime: props.departureTime[i],
      });
    }
  }

  export function updateArrivalTime(e, row) {
    let indexToChange = row["stopNumber"] - 1;
    // TODO add check that arrival time is after departure time of last stop
    props.arrivalTime[indexToChange] = e.target.value;
  }
  export function updateDepartureTime(e, row) {
    let indexToChange = row["stopNumber"] - 1;
    props.departureTime[indexToChange] = e.target.value;
  }
  export function currentArrivalTime(row) {
    let currentIndex = row["stopNumber"] - 1;
    return props.arrivalTime[currentIndex];
  }
  export function currentDepartureTime(row) {
    let currentIndex = row["stopNumber"] - 1;
    return props.departureTime[currentIndex];
  }
  // disable scrolling on number elements
  document.addEventListener("wheel", function(event){
      if(document.activeElement.type === "number"){
          document.activeElement.blur();
      }
  });
  export function updateInitialDepartureTime(e) {
    props.departureTime[0] = e.target.value;
  }

  async function autofillBusRoute() {
    let departureTime = props.departureTime[0].split(":");
    let init_travel_times_user_input = parseInt(departureTime[0])*3600 + parseInt(departureTime[1])*60 + parseInt(departureTime[2]);
    if (!init_travel_times_user_input || !(init_travel_times_user_input >= 21600 && init_travel_times_user_input <= 79200)) {
      alert(
        "Please enter a valid departure time \nBetween 6:00 and 22:00"
      );
    }
    let req = {
      "init_travel_times_user_input": init_travel_times_user_input,
      "atco_list": props.ATCO,
    };
    let resp = await callAutofillBus(req);
    console.log("resp");
    console.log(resp);

    const [arrivalTimes, departureTimes] = setArrivalAndDepartureTimes(init_travel_times_user_input, resp["times"]);
    props.arrivalTime = arrivalTimes;
    props.departureTime = departureTimes;
  }

  function convertSecondsPastMidnightToString(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  }

  function padZero(number) {
    return number < 10 ? `0${number}` : number;
  }

  function setArrivalAndDepartureTimes(init_travel_times_user_input, timeIntervals) {
    let arrivalTimes = ["First stop"];
    let departureTimes = [];
    departureTimes.push(convertSecondsPastMidnightToString(init_travel_times_user_input));
    let previousDepartureTime = init_travel_times_user_input;
    for (let i = 1; i < timeIntervals.length; i++) {
      const arrivalTime = previousDepartureTime + timeIntervals[i];
      previousDepartureTime = arrivalTime + 15;
      arrivalTimes.push(convertSecondsPastMidnightToString(arrivalTime));
      departureTimes.push(convertSecondsPastMidnightToString(previousDepartureTime));
    }  
    departureTimes[departureTimes.length-1] = "Last stop"
    return [arrivalTimes, departureTimes]
  }

</script>

<div style="font-size: 0.9rem">Route name:</div>
<TextInput
  bind:value={props.name}
  style="font-size: 14px; background-color: white; border: 1px solid black; height: 30px; width: 300px;"
/>
<br />

<div style="font-size: 0.9rem">Number of services on route per day:</div>
<input 
  type="number"
  class="numberinput"
  bind:value={props.dailyTrips} 
  min="1" 
/>
<!-- <NumberInput
  hideSteppers
  bind:value={props.dailyTrips}
  style="font-size: 14px; background-color: white; border: 1px solid black; height: 30px;"
/> -->

<br />
<br />
<div style="font-size: 0.9rem">
  Time between each of these services (minutes):
</div>
<input 
  type="number"
  class="numberinput"
  bind:value={props.frequency} 
  min="0" 
/>
<br />
<br />



<div>
  {#if props.ptMode == "bus"}
    Roughly estimate bus timetable
    <br />
    <div style="float: left; font-size: 13px;">
      Departure time:
      <input
        title="Departure time"
        type="time"
        step="2"
        value={props.departureTime[0]}
        on:change={(e) => updateInitialDepartureTime(e)}
        style="padding:5px;"
      />
    </div>
    <button class="grey_button" on:click={autofillBusRoute}>Estimate bus timetable</button>
  {/if}
</div>
<br />
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

<style>
  .numberinput {
    font-size: 14px; 
    background-color: white; 
    border: 1px solid black; 
    height: 30px;
    width: 300px;
  }

  .grey_button {
    background: white;
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 8px;
    font-size: 0.8rem;
    transition: background-color 0.05s ease-in-out;
    float: right;
  }
  .grey_button:hover {
    background: #dfdfdf;
  }
</style>
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
