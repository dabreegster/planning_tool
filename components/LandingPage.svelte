<script>
  export let landingPageToggle = "landed";

  function toggleLandingPage() {
    landingPageToggle = "blank";
  }

  document.addEventListener("mouseup", (e) => {
    toggleLandingPage();
  });
</script>

{#if landingPageToggle === "landed"}
  <div class={landingPageToggle}>
    <h2>Welcome to DFT's connectivity planning tool</h2>
    <br />
    <p class="introText">
      It is currently in prototype phase and please send feedback to
      william.waltersdavis@dft.gov.uk
    </p>
    <br />
    <p class="guideText">To use this:</p>
  </div>
{/if}

<style>
  .introText {
    font-size: 1.2rem;
  }
  .guideText {
    font-size: 1.2rem;
  }
  .landed {
    background-color: white;
    position: absolute;
    width: calc(100% - 700px);
    height: calc(100% - 300px);
    padding: 20px;
    border-radius: 10px;
    right: 350px;
    top: 150px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    scrollbar-width: none;
  }

  .blank {
    display: none;
  }
</style>
