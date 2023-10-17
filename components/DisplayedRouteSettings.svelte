<script>
  export let startTimeSeconds = 28800;
  export let purpose = "Business";

  let purposes = [
    "Business",
    "Education",
    "Health",
    "Entertainment",
    "Shopping",
    "Residential",
  ];

  function updateStartTime(timeString) {
    let [hours, minutes] = timeString.target.value.split(":");
    startTimeSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
  }
</script>

<div class="purposeBox" style="display: flex;">
  <label
    class="govuk-label"
    for="purpose"
    style="margin-right: 10px; margin-top: 5px; font-size: 0.9rem;"
  >
    Displayed route purpose:
  </label>
  <select class="govuk-select" id="purpose" name="purpose" bind:value={purpose}>
    {#each purposes as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<!-- <button class="govuk-label" style="font-size: 1.2rem;" on:click={resetMapAndID}
  >Clear polygons (right click)
</button> -->
<br />
<div class="startTimeSelection">
  <label for="start-time-input" style="font-size: 0.9rem;"
    >Displayed route start time:</label
  >
  <input
    id="start-time-input"
    type="time"
    name="start-time-input"
    value="08:00"
    min="06:00"
    max="22:00"
    style="font-size: 0.9rem; padding:5px; border: 1px solid;"
    on:change={(e) => updateStartTime(e)}
  />
  <span class="validity" />
</div>
<br />
<div>
  <b style="font-size: 0.9rem;">Right click to remove routes</b>
</div>

<style>
  input + span {
    padding-right: 30px;
  }

  input:invalid + span::after {
    position: absolute;
    content: "✖";
    padding-left: 5px;
  }

  input:valid + span::after {
    content: "✓";
    padding-left: 5px;
  }
  select {
    font-size: 0.9rem;
    height: 30px;
    float: right;
    border: 1px solid rgb(0, 0, 0);
  }
</style>
