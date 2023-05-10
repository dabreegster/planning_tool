<script>
  import "govuk-frontend/govuk/all.scss";
  import "carbon-components-svelte/css/white.css";

  import LandingPage from "./components/LandingPage.svelte";
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

  export let innerWidth = 0;
  export let innerHeight = 0;
  export let login_username = "user";
  let login_password = "password";
  let squareID;
  let tileOpacity;
  let hoverInfo;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if login_password !== "connect"}
  <LandingPage bind:login_username bind:login_password />
{/if}

{#if login_password == "connect"}
  <div>
    <Header />
  </div>
  <div>
    <StageBanner />
  </div>
  <div>
    <Map {innerHeight}>
      <OpacitySlider bind:tileOpacity />
      <TileLayer {tileOpacity} />
      <LoadGeojson bind:squareID bind:hoverInfo />
      <PdfDownload {squareID} />
      <ScoreLegend {tileOpacity} />
      <SnapToPostcode />
      <HoverRouteInfo {hoverInfo} />
    </Map>
  </div>
{/if}
