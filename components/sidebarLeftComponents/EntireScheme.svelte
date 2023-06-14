<script>
  import { gjScheme } from "../../stores.js";
  import "carbon-components-svelte/css/white.css";

  const prefix = "dft_connectivity";
  export let innerWidth;

  // Set up local storage sync
  let loadLocal = window.localStorage.getItem(prefix);
  if (loadLocal) {
    try {
      gjScheme.set(JSON.parse(loadLocal));
    } catch (err) {
      console.log(`Failed to load from local storage: ${err}`);
    }
  }
  gjScheme.subscribe((gj) =>
    window.localStorage.setItem(prefix, JSON.stringify(gj))
  );

  function clearAllInterventions() {
    console.log(`gjScheme: ${JSON.stringify(gjScheme)}`);
    if (
      confirm(
        "Do you want to clear the current scheme? (You should save it first!)"
      )
    ) {
      gjScheme.update((gj) => {
        gj.features = gj.features.filter(
          (feature) => feature.properties.select_area == true
        );
        return gj;
      });
    }
  }

  function exportToGeojson() {
    const geojson = $gjScheme;
    var filename = prefix;
    // Include the scheme name if it's set
    if (geojson["scheme_name"]) {
      filename += "_" + geojson["scheme_name"];
    }
    filename += ".geojson";
    downloadGeneratedFile(filename, JSON.stringify(geojson, null, "  "));
  }

  function downloadGeneratedFile(filename, textInput) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8, " + encodeURIComponent(textInput)
    );
    element.setAttribute("download", filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function loadFile(e) {
    const reader = new FileReader();
    // TODO No await? :(
    // TODO Should we prompt before deleting the current scheme?
    reader.onload = (e) => {
      try {
        gjScheme.set(JSON.parse(e.target.result));
      } catch (err) {
        console.log(`Couldn't load from a file: ${err}`);
        window.alert(`Couldn't load scheme from a file: ${err}`);
      }
    };
    reader.readAsText(e.target.files[0]);
  }
  function countFeatures(gjScheme, boolean) {
    let count = 0;
    gjScheme.features.forEach((feature) => {
      if (feature.properties.select_area !== boolean) {
        count++;
      }
    });
    return count;
  }

  function scaleButtonWidth(innerWidth, minWidth, widthFraction) {
    let sideBarWidth = innerWidth * 0.25;
    if (sideBarWidth < 370) {
      return sideBarWidth * widthFraction;
    } else {
      return minWidth;
    }
  }
</script>

<div class="govuk-form-group">
  <h1 class="govuk-label-wrapper">
    <label
      class="govuk-label govuk-label--m"
      for="event-name"
      style="float: left"
    >
      Scheme name:
    </label>
  </h1>
  <input
    class="govuk-input"
    id="event-name"
    name="event-name"
    type="text"
    bind:value={$gjScheme.scheme_name}
  />
</div>

<div>
  <!-- TODO Interactive elements inside a label are apparently invalid, but this works -->
  <label>
    <input type="file" id="load_geojson" on:change={loadFile} />
    <button
      class="govuk-button"
      type="button"
      onclick="document.getElementById('load_geojson').click();"
      style="font-size: 1rem; width: calc({scaleButtonWidth(
        innerWidth,
        165,
        0.41
      )}px);"
    >
      Load from GeoJSON
    </button>
  </label>

  <button
    type="button"
    class="govuk-button"
    style="float: right; font-size: 1rem; width: calc({scaleButtonWidth(
      innerWidth,
      165,
      0.41
    )}px);"
    on:click={exportToGeojson}
    disabled={$gjScheme.features.length == 0}
  >
    Export to GeoJSON
  </button>
</div>

<br />

<div class="govuk-heading-s">
  <span>{countFeatures($gjScheme, true)} interventions </span>
  <button
    type="button"
    class="govuk-button govuk-button--warning"
    style="font-size: 14px; float: right"
    on:click={clearAllInterventions}
    disabled={$gjScheme.features.length == 0}>Clear interventions</button
  >
</div>

<style>
  input[type="file"] {
    cursor: pointer;

    /* Make the input type=file effectively invisible, but still let browser accessibility stuff work */
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
</style>
