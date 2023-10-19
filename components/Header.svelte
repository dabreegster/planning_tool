<script>
  export let landingPageToggle = "landed";

  function toggleLandingPage() {
    if (landingPageToggle == "blank") {
      landingPageToggle = "landed";
    } else {
      landingPageToggle = "blank";
    }
  }
</script>

<header class="govuk-header" role="banner" data-module="govuk-header">
  <div class="govuk-header__container govuk-width-container">
    <div class="govuk-header__logo">
      <a
        href="https://www.gov.uk/government/organisations/department-for-transport"
        class="govuk-header__link govuk-header__link--homepage"
        title="Go to DfT homepage"
        target="_blank"
      >
        <span class="govuk-header__logotype">
          <img
            aria-label="DfT logo"
            src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/dft-logo-white.png"
            height="26"
            style="width:auto"
          />
        </span>
      </a>
    </div>
    <div class="govuk-header__content">
      <span class="govuk-header__link govuk-header__link--service-name"
        >Connectivity Planning Tool</span
      >
      <span
        class="govuk-header__logotype"
        style="float:right; margin-top: 3px; margin-bottom: -5px;"
      >
        <a
          class="govuk-heading-s"
          style="color: white; cursor: pointer; font-size: 1.1rem;"
          on:click={toggleLandingPage}
        >
          View guide
        </a>
      </span>
    </div>
  </div>
</header>

<style>
  a:hover {
    text-decoration: underline;
  }
</style>
