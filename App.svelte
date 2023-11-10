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
  import LaLevelScores from "./components/LALevelScores.svelte";
  import TileLayer from "./components/TileLayer.svelte";


  export let innerWidth = 0;
  export let innerHeight = 0;
  export let login_username = "user";
  let infoForPDF;
  let tileOpacity = [50];
  let hoverInfo;
  let responseJson;
  let loading;
  let stopLayerToggle;
  let hoveredInterventionScores;
  let purpose;
  let startTimeSeconds;
  let open;
  let stopStatuses;
  let scoreLayer;
  let stopCheckboxClicked;
  let line_toggle;
  let LASelected;
  let landingPageToggle;
  let tileScoreLayer;
  let toggleDisplayeRouteOnClick;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div>
  <Header bind:landingPageToggle />
</div>
<div>
  <StageBanner />
</div>
<div>
  <Map {innerHeight}>
    <StopsLayer {stopLayerToggle} {stopCheckboxClicked} bind:stopStatuses />
    <DrawControls {open} bind:stopLayerToggle bind:line_toggle />
    <TileLayer {tileOpacity} {tileScoreLayer}/>
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
      bind:stopStatuses
      bind:tileOpacity
      bind:purpose
      bind:startTimeSeconds
      bind:stopCheckboxClicked
      bind:LASelected
      bind:tileScoreLayer
      bind:toggleDisplayeRouteOnClick
    />
    <LoadGeojson
      {purpose}
      {startTimeSeconds}
      {toggleDisplayeRouteOnClick}
      bind:infoForPDF
      bind:hoverInfo
    />
    <HoverRouteInfo {hoverInfo} />
    <CurrentInterventionLayer
      {responseJson}
      {scoreLayer}
      bind:hoveredInterventionScores
    />
    <!-- <SidebarExplore
      {leftSidebarClassToggle}
      {tileOpacity}
      bind:exploreSidebarClassToggle
    /> -->
    <LandingPage bind:landingPageToggle />
    <LeftAccordion
      {tileOpacity}
      {innerWidth}
      {login_username}
      {hoveredInterventionScores}
      bind:responseJson
      bind:open
      bind:loading
      bind:scoreLayer
      bind:stopLayerToggle
      bind:line_toggle
    />
    <LaLevelScores {LASelected} {tileOpacity} bind:tileScoreLayer={tileScoreLayer}/>
  </Map>
</div>

<style>
</style>
