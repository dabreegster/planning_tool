<script>
  import { Accordion, AccordionItem } from "carbon-components-svelte";
  import BuildingForm from "./interventionListComponents/BuildingForm.svelte";
  import RouteForm from "./interventionListComponents/RouteForm.svelte";
  import AreaForm from "./interventionListComponents/AreaForm.svelte"
  import PathwayForm from "./interventionListComponents/PathwayForm.svelte";
  import CsvRouteForm from "./interventionListComponents/CsvRouteForm.svelte";
  import PerInterventionControls from "./interventionListComponents/PerInterventionControls.svelte";
  import { gjScheme, currentSidebarHover, currentMapHover } from "../../stores.js";

  const prefix = "dft_connectivity";

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

  function clearAllAreas() {
    if (confirm("Do you want to clear the current custom areas?")) {
      gjScheme.update((gj) => {
        gj.features = gj.features.filter(
          (feature) => feature.properties.select_area !== true
        );
        return gj;
      });
    }
  }

  function interventionName(feature) {
    if (feature.properties.name) {
      return feature.properties.name;
    }
    if (
      feature.geometry.type == "LineString" &&
      feature.properties.new_pathway
    ) {
      return "Untitled pathway";
    }
    if (
      feature.geometry.type == "LineString" &&
      feature.properties.ptMode == "bus"
    ) {
      return "Untitled bus route";
    }
    if (
      feature.geometry.type == "LineString" &&
      feature.properties.ptMode == "rail"
    ) {
      return "Untitled rail route";
    }
    if (
      feature.geometry.type == "LineString" &&
      feature.properties.ptMode == "ferry"
    ) {
      return "Untitled ferry route";
    }
    if (feature.properties.select_area) {
      return "Untitled area";
    }
    return "Untitled building";
  }

  // TODO Not sure why we can't inline this one below
  function reset() {
    currentSidebarHover.set(null);
  }

  function closeOtherForms(id) {
    for (let f of $gjScheme.features) {
      if (f.properties.editing && f.id != id) {
        delete f.properties.editing;
        return;
      }
    }
  }

  function countFeatures(gjScheme, boolean) {
    let count = 0;
    gjScheme.features.forEach((feature) => {
      if (feature.properties.select_area == boolean) {
        count++;
      }
    });
    return count;
  }
</script>

<Accordion class="govuk-accordion" data-module="govuk-accordion">
  {#each $gjScheme.features as feature}
    {#if feature.csv_uploaded !== true && feature.properties.select_area !== true}
      <AccordionItem
        bind:open={feature.properties.editing}
        on:click={closeOtherForms(feature.id)}
        on:mouseenter={currentSidebarHover.set(feature.id)}
        on:mouseleave={reset}
      >
        <svelte:fragment slot="title">
          {#if feature.id == $currentMapHover}
            <strong> {interventionName(feature)}</strong>
          {:else}
            {interventionName(feature)}
          {/if}
        </svelte:fragment>
        <div class="govuk-body">
          {#if feature.geometry.type == "LineString" && feature.properties.new_pathway}
            <PathwayForm bind:props={feature.properties} />
          {:else if feature.geometry.type == "LineString"}
            {#if feature.properties.from_csv}
              <CsvRouteForm bind:props={feature.properties} />
            {:else}
              <RouteForm bind:props={feature.properties} />
            {/if}
          {:else}
            <BuildingForm bind:props={feature.properties} />
          {/if}
          <br />
          <PerInterventionControls id={feature.id} />
        </div>
      </AccordionItem>
    {/if}
  {/each}
</Accordion>
<br />
<br />
<div class="govuk-heading-s">
  <span>{countFeatures($gjScheme, true)} custom areas</span>
  <button
    type="button"
    class="govuk-button govuk-button--warning"
    style="font-size: 14px; float: right"
    on:click={clearAllAreas}
    disabled={$gjScheme.features.length == 0}>Clear custom areas</button
  >
</div>
<br />

<Accordion class="govuk-accordion" data-module="govuk-accordion">
  {#each $gjScheme.features as feature}
    {#if feature.properties.select_area}
      <AccordionItem
        bind:open={feature.properties.editing}
        on:click={closeOtherForms(feature.id)}
        on:mouseenter={currentSidebarHover.set(feature.id)}
        on:mouseleave={reset}
      >
        <svelte:fragment slot="title">
          {#if feature.id == $currentMapHover}
            <strong>{interventionName(feature)}</strong>
          {:else}
            {interventionName(feature)}
          {/if}
        </svelte:fragment>
        <div class="govuk-body">
          <AreaForm bind:props={feature.properties} />
          <br />
          <PerInterventionControls id={feature.id} />
        </div>
      </AccordionItem>
    {/if}
  {/each}
</Accordion>
