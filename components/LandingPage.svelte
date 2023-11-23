<script>
  export let landingPageToggle;

  function toggleLandingPage() {
    landingPageToggle = "blank";
  }

  // document.addEventListener("mouseup", (e) => {
  //   toggleLandingPage();
  // });
</script>

{#if landingPageToggle === "landed"}
  <div class="landed">
    <h3>
      <button on:click={toggleLandingPage} class="close-button">X</button>
      Welcome to DFT's Connectivity Planning Tool
    </h3>
    <br />
    The Connectivity Planning Tool provides information on Connectivity to the professional
    planning community. This tool allows planners to see where new developments may
    be best placed, or what the impact of new transportation interventions could
    be.
    <br />
    <br />
    <h4>What is Connectivity?</h4>
    The DfT Connectivity metric quantifies someone’s ability to get where they want
    to go. It measures opportunity to travel to various destinations, weighted by
    people's overall proclivity to take those options. It aims to capture the most
    common modes of travel and destination types, the time required to reach these
    destinations, the value presented by the destinations, and people's travel preferences.
    It doesn’t show how many people actually take different routes: purely their
    opportunity to do so. Nor is it a transport model: there are no trip assignment
    or convergence processes.
    <br />
    <br />
    <h4>What is the Connectivity Planning Tool?</h4>
    The Connectivity Planning Tool serves the professional planning community by
    offering valuable insights into the connectivity of locations within England
    and Wales. With this tool, users can analyze current connectivity, generate comprehensive
    reports, and even model the effects of new transportation initiatives. Here's
    how a user can leverage its features:
    <br />
    <br />
    <p class="italic">Access Connectivity Scores:</p>
    <ol>
      <li>
        1. Choose a Local Authority (LA) from the dropdown list to zoom into
        that area on the map. The map will visually indicate the LA's
        Connectivity using a color gradient.
      </li>
      <li>
        2. Click on a map square, each representing a 100x100 meter area, to
        view detailed, mode-specific Connectivity scores. The primary public
        transport and walking routes, along with key destinations, will be
        highlighted.
      </li>
      <li>
        3. For deeper analysis, you can download a PDF report of a selected
        square's Connectivity metrics, which also includes the data from option
        1 and 2.
      </li>
    </ol>
    <br />
    <p class="italic">Analyse National Connectivity:</p>
    To view connectivity levels across England and Wales, simply select your desired
    mode-and-purpose combination from the dropdown menu.
    <br />
    <br />
    <p class="italic">Plan New Transportation Routes:</p>
    To propose new transit interventions, click on the map to add stops for buses,
    trams, ferries, or rail services. These stops will be connected with lines, which
    represent the new public transport lines. Specify the frequency of services,
    and input timetables. To assess the intervention's impact, select an area of
    interest and re-calculate the Connectivity metrics.
    <br />
    By offering these functionalities, the Connectivity Planning Tool empowers planners
    to make data-driven decisions for improving regional transportation and connectivity.
  </div>
{/if}

<style>
  .italic {
    font-style: italic;
  }
  .landed {
    background-color: white;
    position: absolute;
    width: calc(100% - 1000px);
    height: calc(100% - 200px);
    padding: 20px;
    border-radius: 10px;
    right: 500px;
    top: 100px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    font-size: 0.8rem;
    /* scrollbar-width: none; */
  }

  .blank {
    display: none;
  }
  .close-button {
    float: right;
    font-size: 30px; /* Adjust the size as needed */
    background: transparent;
    border: none;
    cursor: pointer;
    /* opacity: 0; */
  }
</style>
