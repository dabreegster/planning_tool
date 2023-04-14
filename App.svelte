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

  export let innerWidth = 0;
  export let innerHeight = 0;
  export let login_username = "user";
  let login_password = "connect";
  let squareID;
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
      <TileLayer />
      <LoadGeojson bind:squareID />
      <PdfDownload {squareID} />
      <ScoreLegend/>
    </Map>
  </div>
{/if}
