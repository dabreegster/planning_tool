<script>
  import { NumberInput, TextInput, DataTable } from "carbon-components-svelte";
  import { gjScheme } from "../stores.js";

  import { onMount, getContext } from "svelte";

  const { getMap } = getContext("map");

  // TODO fix importing this from RouteForm.svelte
  // import {
  //   updateArrivalTime,
  //   updateDepartureTime,
  //   currentArrivalTime,
  //   currentDepartureTime,
  //   headers, } from "./sidebarLeftComponents/interventionListComponents/RouteForm.svelte";

  let step = 0;
  let ptMode = "Bus";
  export let drawing = false;
  export let line_toggle = "new_pt_route";
  export let stopLayerToggle;

  const steps = [
    "Select mode",
    "Draw route",
    "Number of services on route",
    "Time between services on route (minutes)",
    "Fillout timetable for the first service on the route",
    "Route name",
  ];

  // Move to next step when route drawn
  onMount(async () => {
    const map = getMap();
    map.on("draw.create", async (e) => {
      step += 1;
    });
  });

  function publicTransportModes() {
    let modes = [
      "Bus",
      "National Rail",
      "Tube/Lightrail/Metro",
      "Tram",
      "Ferry",
    ];
    return modes;
  }

  function drawRoute() {
    drawing = true;
    line_toggle = "new_pt_route";
    if (ptMode == "Bus") {
      stopLayerToggle = "bus";
    } else if (ptMode == "National Rail") {
      stopLayerToggle = "rail";
    } else if (ptMode == "Tube/Lightrail/Metro") {
      stopLayerToggle = "tube_lightrail_metro";
    } else if (ptMode == "Tram") {
      stopLayerToggle = "tram";
    } else if (ptMode == "Ferry") {
      stopLayerToggle = "ferry";
    } else {
      console.log("ptMode not selected");
    }
  }

  function nextStep() {
    if (step < steps.length - 1) {
      step += 1;
    }
  }

  function prevStep() {
    if (step > 0) {
      step -= 1;
    }
  }
  function Confirm() {}

  let newRoute;

  $: {
    let features = $gjScheme.features;
    // select last feature if not select_area type
    if (features[features.length - 1]["properties"]["select_area"] != true) {
      newRoute = features[features.length - 1];
    }
  }

  let rows = [];
  $: {
    if (newRoute) {
      rows = [];
      for (let i = 0; i < newRoute.properties.ATCO.length; i++) {
        rows.push({
          id: newRoute.properties.ATCO[i],
          arrivalTime: newRoute.properties.arrivalTime[i],
          departureTime: newRoute.properties.departureTime[i],
        });
      }
    }
  }

  let headers = [
    { key: "id", value: "Stop ATCO" },
    { key: "arrivalTime", value: "Arrival time" },
    { key: "departureTime", value: "Departure time" },
  ];

  function updateArrivalTime(e, row) {
    let indexToChange = newRoute.properties.ATCO.indexOf(row["id"]);
    // TODO add check that arrival time is after departure time of last stop
    newRoute.properties.arrivalTime[indexToChange] = e.target.value;
  }
  function updateDepartureTime(e, row) {
    let indexToChange = newRoute.properties.ATCO.indexOf(row["id"]);
    newRoute.properties.departureTime[indexToChange] = e.target.value;
  }
  function currentArrivalTime(row) {
    let currentIndex = newRoute.properties.ATCO.indexOf(row["id"]);
    return newRoute.properties.arrivalTime[currentIndex];
  }
  function currentDepartureTime(row) {
    let currentIndex = newRoute.properties.ATCO.indexOf(row["id"]);
    return newRoute.properties.departureTime[currentIndex];
  }
</script>

<main>
  {#if step === 0}
    <h3>{steps[step]}</h3>
    <select
      class="govuk-select"
      id="scoreLayer"
      name="scoreLayer"
      bind:value={ptMode}
    >
      {#each publicTransportModes() as x}
        <option value={x}>{x}</option>
      {/each}
    </select>
    <button on:click={nextStep} style="float: right;">Contine</button>
  {:else if step === 1}
    <h3>{steps[step]}</h3>
    <button on:click={drawRoute}>Draw route</button>
    <!-- <button on:click={nextStep} style="float: right;">Contine</button> -->
    <!-- <br/> -->
    <!-- <button on:click={prevStep}>Back</button> -->
  {:else if step === 2}
    <h3>{steps[step]}</h3>
    <NumberInput
      hideSteppers
      bind:value={newRoute.properties.dailyTrips}
      style="font-size: 16px; background-color: white; border: 1px solid black;"
    />
    <br />
    <!-- <button on:click={prevStep}>Back</button> -->
    <button on:click={nextStep}>Contine</button>
  {:else if step === 3}
    <h3>{steps[step]}</h3>
    <NumberInput
      hideSteppers
      bind:value={newRoute.properties.frequency}
      style="font-size: 16px; background-color: white; border: 1px solid black;"
    />
    <br />
    <!-- <button on:click={prevStep}>Back</button> -->
    <button on:click={nextStep}>Contine</button>
  {:else if step === 4}
    <h3>{steps[step]}</h3>

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
    <br />
    <!-- <button on:click={prevStep}>Back</button> -->
    <button on:click={nextStep}>Contine</button>
  {:else if step === 5}
    <h3>{steps[step]}</h3>
    <TextInput
      bind:value={newRoute.properties.name}
      style="font-size: 16px; background-color: white; border: 1px solid black;"
    /> <br />
    <!-- <button on:click={prevStep}>Back</button> -->
    <button on:click={nextStep}>Contine</button>
  {:else if step > 0 && step < steps.length - 1}
    <h3>{steps[step]}</h3>
    <button on:click={prevStep}>Back</button>
    <button on:click={nextStep}>Contine</button>
  {:else}
    <h3>{steps[step]}</h3>
    <button on:click={prevStep}>Back</button>
    <button on:click={Confirm}>Confirm</button>
  {/if}
</main>

<style>
  button {
    background: white;
    padding: 10px;
    border-radius: 8px;
    transition: background-color 0.3s ease-in-out;
  }
  button:hover {
    background: #dfdfdf;
  }
</style>
