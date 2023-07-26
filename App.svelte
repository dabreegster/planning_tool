<script>
  import "govuk-frontend/govuk/all.scss";
  import "carbon-components-svelte/css/white.css";

  import Map from "./components/Map.svelte";
  import Header from "./components/Header.svelte";
  import StageBanner from "./components/StageBanner.svelte";
  import TileLayer from "./components/TileLayer.svelte";
  import LoadGeojson from "./components/LoadGeojson.svelte";
  import ScoreLegend from "./components/ScoreLegend.svelte";
  import PdfDownload from "./components/PdfDownload.svelte";
  import OpacitySlider from "./components/OpacitySlider.svelte";
  import SnapToPostcode from "./components/SnapToPostcode.svelte";
  import HoverRouteInfo from "./components/HoverRouteInfo.svelte";
  import SidebarLeft from "./components/SidebarLeft.svelte";
  import DrawControls from "./components/DrawControls.svelte";
  import StopsLayer from "./components/StopsLayer.svelte";
  import CurrentInterventionLayer from "./components/CurrentInterventionLayer.svelte";
  import SidebarExplore from "./components/SidebarExplore.svelte";
  import SatelliteLayer from "./components/SatelliteLayer.svelte";

  export let innerWidth = 0;
  export let innerHeight = 0;
  export let login_username = "user";
  let squareID;
  let tileOpacity;
  let hoverInfo;
  let responseJson;
  let leftSidebarClassToggle;
  let loading;
  let stopLayerToggle;
  let drawing;
  let hoveredInterventionScores;
  let exploreSidebarClassToggle;
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
    <SidebarLeft
      {innerWidth}
      {login_username}
      {hoveredInterventionScores}
      {exploreSidebarClassToggle}
      bind:responseJson
      bind:leftSidebarClassToggle
      bind:loading
    />
    <DrawControls {leftSidebarClassToggle} bind:stopLayerToggle bind:drawing />
    <StopsLayer {stopLayerToggle} />
    <OpacitySlider bind:tileOpacity />
    <TileLayer {tileOpacity} />
    <LoadGeojson {drawing} bind:squareID bind:hoverInfo />
    <PdfDownload {squareID} />
    <ScoreLegend {tileOpacity} />
    <SnapToPostcode />
    <HoverRouteInfo {hoverInfo} />
    <CurrentInterventionLayer {responseJson} bind:hoveredInterventionScores />
    <SidebarExplore
      {leftSidebarClassToggle}
      {tileOpacity}
      bind:exploreSidebarClassToggle
    />
    <SatelliteLayer />
  </Map>
</div>
