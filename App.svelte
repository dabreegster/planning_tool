<script>
  import "govuk-frontend/govuk/all.scss";
  import "carbon-components-svelte/css/white.css";

  import Map from "./components/Map.svelte";
  import Header from "./components/Header.svelte";
  import StageBanner from "./components/StageBanner.svelte";
  import LoadGeojson from "./components/LoadGeojson.svelte";
  import HoverRouteInfo from "./components/HoverRouteInfo.svelte";
  import DrawControls from "./components/DrawControls.svelte";
  import CurrentInterventionLayer from "./components/CurrentInterventionLayer.svelte";
  import Settings from "./components/Settings.svelte";
  import LandingPage from "./components/LandingPage.svelte";
  import StopsLayer from "./components/StopsLayer.svelte";
  import LeftAccordion from "./components/LeftAccordion.svelte";

  export let innerWidth = 0;
  export let innerHeight = 0;
  export let login_username = "user";
  let infoForPDF;
  let tileOpacity = [70];
  let hoverInfo;
  let responseJson;
  let loading;
  let stopLayerToggle;
  let drawing;
  let hoveredInterventionScores;
  let purpose;
  let startTimeSeconds;
  let open;
  let stopStatuses;
  // needs to be in bind:stopStatuses={stopStatuses} form
  // npm run fmt ruins this
  let stopCheckboxClicked;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div>
  <Header />
</div>
<div>
  <StageBanner />
</div>
<div>
  <Map {innerHeight}>
    <StopsLayer
     {stopLayerToggle}
     {stopCheckboxClicked}
     bind:stopStatuses={stopStatuses} />
    <!-- <SidebarLeft
      {innerWidth}
      {login_username}
      {hoveredInterventionScores}
      {exploreSidebarClassToggle}
      bind:responseJson
      bind:leftSidebarClassToggle
      bind:loading
    /> -->
    <Settings
      {infoForPDF}
      bind:stopStatuses={stopStatuses}
      bind:tileOpacity
      bind:purpose
      bind:startTimeSeconds
      bind:stopCheckboxClicked
    />
    <LoadGeojson
      {drawing}
      {purpose}
      {startTimeSeconds}
      bind:infoForPDF
      bind:hoverInfo
    />
    <HoverRouteInfo {hoverInfo} />
    <CurrentInterventionLayer {responseJson} bind:hoveredInterventionScores />
    <!-- <SidebarExplore
      {leftSidebarClassToggle}
      {tileOpacity}
      bind:exploreSidebarClassToggle
    /> -->
    <LandingPage />
    <LeftAccordion
      {tileOpacity}
      {innerWidth}
      {login_username}
      {hoveredInterventionScores}
      bind:responseJson
      bind:open
      bind:loading
    />
    <DrawControls {open} bind:stopLayerToggle bind:drawing />
  </Map>
</div>
