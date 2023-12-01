<script>
  export let tileOpacity;
  export let infoForPDF;
  export let tileSettings;
  export let hoverScore;

  let linePositionFromLeft = 0;
  let weightedOverallScore;
  // $: {
  //   if (infoForPDF) {
  //     // select overall score for each mode (not just [6] as currently health not calculated for PT)
  //     let overallPTScore =
  //       infoForPDF["squareScores"]["pt"][
  //         infoForPDF["squareScores"]["pt"].length - 1
  //       ];
  //     let overallCyclingScore =
  //       infoForPDF["squareScores"]["cycling"][
  //         infoForPDF["squareScores"]["cycling"].length - 1
  //       ];
  //     let overallWalkScore =
  //       infoForPDF["squareScores"]["walk"][
  //         infoForPDF["squareScores"]["walk"].length - 1
  //       ];

  //     // weigh to overall score
  //     weightedOverallScore = Math.round(
  //       overallPTScore * 0.5 +
  //         overallCyclingScore * 0.25 +
  //         overallWalkScore * 0.25
  //     );
  //     // calculate linePositionFromLeft in pixels
  //     linePositionFromLeft = weightedOverallScore * 3.645;
  //   }
  // }
  $: {
    if (hoverScore) {
      // calculate linePositionFromLeft in pixels
      linePositionFromLeft = hoverScore * 3.645;
    }
  }
  // TODO: temp hacky fix for alpha release, fix this
  function calcNationalNumberPixelGap(number) {
    if (number == 0) {
      return -2;
    } else if (number != 100) {
      return 78;
    } else {
      return 71;
    }
  }
  // TODO find function which can create this
  const nipy_spectral_100 = [
    "#000000",
    "#130015",
    "#2f0035",
    "#41004b",
    "#5d006b",
    "#700080",
    "#7a008b",
    "#7d008e",
    "#810092",
    "#850096",
    "#870098",
    "#6d009c",
    "#58009f",
    "#3800a3",
    "#2300a6",
    "#0300aa",
    "#0000b1",
    "#0000bd",
    "#0000c9",
    "#0000d1",
    "#0000dd",
    "#0013dd",
    "#002fdd",
    "#0041dd",
    "#005ddd",
    "#0078dd",
    "#007ddd",
    "#0085dd",
    "#008add",
    "#0092dd",
    "#0098dd",
    "#009cd3",
    "#009fcb",
    "#00a3bf",
    "#00a7b3",
    "#00aaab",
    "#00aaa3",
    "#00aa9d",
    "#00aa95",
    "#00aa90",
    "#00aa88",
    "#00a773",
    "#00a353",
    "#009f33",
    "#009d1d",
    "#009a00",
    "#009f00",
    "#00a700",
    "#00ac00",
    "#00b400",
    "#00bc00",
    "#00c200",
    "#00ca00",
    "#00cf00",
    "#00d700",
    "#00dc00",
    "#00e400",
    "#00ea00",
    "#00f200",
    "#00fa00",
    "#00ff00",
    "#2cff00",
    "#49ff00",
    "#75ff00",
    "#93ff00",
    "#bcff00",
    "#c4fc00",
    "#d0f800",
    "#dcf400",
    "#e4f100",
    "#efed00",
    "#f1e700",
    "#f5df00",
    "#f8da00",
    "#fcd200",
    "#ffc900",
    "#ffc100",
    "#ffb500",
    "#ffad00",
    "#ffa100",
    "#ff9900",
    "#ff7500",
    "#ff5d00",
    "#ff3900",
    "#ff1500",
    "#fe0000",
    "#f60000",
    "#f10000",
    "#e90000",
    "#e40000",
    "#dc0000",
    "#da0000",
    "#d60000",
    "#d20000",
    "#cf0000",
    "#cc0c0c",
    "#cc2c2c",
    "#cc5c5c",
    "#cc7c7c",
    "#ccacac",
    "#cccccc",
  ];

  const laScoreColours = [
    "#614a4a",
    "#776A80",
    "#9594c7",
    "#bccff5",
    "#8ef4f5",
    "#94fa94",
    "#f9fa94",
    "#f6bca8",
    "#f48f8e",
    "#c69494",
  ];

  function getModeText(mode) {
    return mode;
  }
  function getPurposeText(purpose) {
    if (purpose == "Overall") {
      return " all purposes";
    } else {
      return purpose.toLowerCase();
    }
  }
</script>

<div>
  {#if tileSettings["level"] === "National"}
    <div class="legendtitle">
      <div class="legendtitle-text"> {getModeText(tileSettings["mode"])} connectivity score for {getPurposeText(tileSettings["purpose"])}:</div>
      {#if hoverScore}
        <div
          class="greybox"
          title="Overall connectivity score for selected square"
        >
          {hoverScore}
        </div>
      {:else}
        <div class="greybox" style="opacity: 0;">99</div>
      {/if}
    </div>
    <div class="legend">
      {#if hoverScore}
        <div class="scoreline" style="left: {linePositionFromLeft}px" />
      {/if}
      {#each nipy_spectral_100 as colour}
        <div
          class="national_square"
          style="background-color: {colour}; opacity: {tileOpacity / 100};"
        />
      {/each}
    </div>
    <div class="national_numbers">
      {#each [0, 25, 50, 75, 100] as number}
        <div style="margin-left: {calcNationalNumberPixelGap(number)}px">
          {number}
        </div>
      {/each}
    </div>
  {:else if tileSettings["level"] === "Local authority"}
    <div class="legendtitle">
      <div class="legendtitle-text">Local authority connectivity decile:</div>
      <div class="greybox" style="opacity: 0;">99</div>
      <!-- TODO: when get decile on click load in which decile here-->
      <!-- {#if infoForPDF}
        <div
          class="greybox"
          title="Overall connectivity score for selected square"
        >
          {weightedOverallScore}
        </div>
      {:else}
        <div class="greybox" style="opacity: 0;">99</div>
      {/if} -->
    </div>
    <div class="legend">
      {#each laScoreColours as colour}
        <div
          class="LA_square"
          style="background-color: {colour}; opacity: {tileOpacity / 100};"
        />
      {/each}
    </div>
    <div class="national_numbers" style="margin-left: 5px">
      {#each ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"] as decile}
        <div style="margin-right: 18px">
          {decile}
        </div>
      {/each}
    </div>
  {:else}
    <!-- if add new tile layer/colour schemes add here -->
  {/if}
</div>

<style>
  .legend {
    display: flex;
    border: 1px solid black;
    position: relative;
  }
  .national_square {
    width: 5px;
    height: 32px;
  }
  .LA_square {
    width: 50px;
    height: 32px;
  }
  .scoreline {
    width: 3px;
    height: 32px;
    background-color: #000000;
    opacity: 1;
    position: absolute;
    z-index: 1;
  }

  .national_numbers {
    display: flex;
    height: 10px;
    color: black;
    opacity: 1;
    font-size: 0.8rem;
  }

  .legendtitle {
    font-size: 1rem;
    padding-bottom: 3px;
    display: flex;
    align-items: center;
  }

  .legendtitle-text {
    padding-right: 6px;
    padding-bottom: 2px;
  }

  .greybox {
    background: #f0f0f0;
    padding: 5px;
    border-radius: 10px;
    border: 1px solid rgb(229, 229, 229);
    min-width: min-content;
    font-size: 1.2rem;
  }
</style>
