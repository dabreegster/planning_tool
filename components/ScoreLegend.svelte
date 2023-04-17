<script>
  export let tileOpacity;

  let paddedNumbers = [
    0,
    " ",
    " ",
    25,
    " ",
    " ",
    50,
    " ",
    " ",
    75,
    " ",
    " ",
    100,
  ];

  // TODO Simplify this function, probably packages avilable
  function getHexColors() {
    const colors = {
      0: "#67001f",
      10: "#67001f",
      20: "#b2182b",
      30: "#d6604d",
      40: "#f4a582",
      50: "#fddbc7",
      60: "#d1e5f0",
      70: "#92c5de",
      80: "#4393c3",
      90: "#2166ac",
      100: "#053061",
    };
    const hexColors = [];
    for (let i = 0; i <= 100; i++) {
      const lowerColor = colors[Math.floor(i / 10) * 10];
      const upperColor = colors[Math.ceil(i / 10) * 10];
      const interpolatedColor = interpolateColor(
        lowerColor,
        upperColor,
        (i % 10) / 10
      );
      hexColors.push(interpolatedColor);
    }
    return hexColors;
  }

  function interpolateColor(lowerColor, upperColor, factor) {
    const lowerColorArray = [];
    lowerColorArray.push(parseInt(lowerColor.substring(1, 3), 16));
    lowerColorArray.push(parseInt(lowerColor.substring(3, 5), 16));
    lowerColorArray.push(parseInt(lowerColor.substring(5, 7), 16));

    const upperColorArray = [];
    upperColorArray.push(parseInt(upperColor.substring(1, 3), 16));
    upperColorArray.push(parseInt(upperColor.substring(3, 5), 16));
    upperColorArray.push(parseInt(upperColor.substring(5, 7), 16));

    const interpolatedColorArray = [];
    for (let i = 0; i < 3; i++) {
      interpolatedColorArray.push(
        Math.round(
          lowerColorArray[i] +
            factor * (upperColorArray[i] - lowerColorArray[i])
        )
      );
    }

    let interpolatedColor = "#";
    for (let i = 0; i < 3; i++) {
      const hex = interpolatedColorArray[i].toString(16).padStart(2, "0");
      interpolatedColor += hex;
    }
    return interpolatedColor;
  }
  let colours = getHexColors();
</script>

<div class="box">
  <div class="legendtitle">Connectivity score</div>
  <br />
  <div class="legend">
    {#each colours as colour}
      <div class="square" style="background-color: {colour}; opacity: {tileOpacity/100};" />
    {/each}
  </div>

  <div class="legend">
    {#each paddedNumbers as number}
      <div class="numbers">
        {number}
      </div>
    {/each}
  </div>
</div>

<style>
  .legendtitle {
    font-size: 1.5rem;
  }
  .legend {
    display: flex;
  }
  .square {
    width: 4px;
    height: 50px;
  }
  .numbers {
    width: 35px;
    height: 10px;
    color: black;
    opacity: 1;
    font-size: 0.9rem;
  }

  .box {
    background-color: white;
    position: absolute;
    width: 430px;
    padding: 16px;
    border-radius: 10px;
    right: 10px;
    top: 5px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    scrollbar-width: none;
  }
</style>
