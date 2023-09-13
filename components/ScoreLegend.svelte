<script>
  export let tileOpacity;

  // TODO fix this hack way of doing numbers
  let paddedNumbers = [
    0,
    " ",
    " ",
    " ",
    25,
    " ",
    " ",
    " ",
    50,
    " ",
    " ",
    " ",
    75,
    " ",
    " ",
    " ",
    100,
  ];

  // TODO find function which can create this
  let nipy_spectral_100 = [
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

  // TODO Simplify this function, probably packages avilable
  // function getHexColors() {
  //   const colors = {
  //     0: "#67001f",
  //     10: "#67001f",
  //     20: "#b2182b",
  //     30: "#d6604d",
  //     40: "#f4a582",
  //     50: "#fddbc7",
  //     60: "#d1e5f0",
  //     70: "#92c5de",
  //     80: "#4393c3",
  //     90: "#2166ac",
  //     100: "#053061",
  //   };
  //   const hexColors = [];
  //   for (let i = 0; i <= 100; i++) {
  //     const lowerColor = colors[Math.floor(i / 10) * 10];
  //     const upperColor = colors[Math.ceil(i / 10) * 10];
  //     const interpolatedColor = interpolateColor(
  //       lowerColor,
  //       upperColor,
  //       (i % 10) / 10
  //     );
  //     hexColors.push(interpolatedColor);
  //   }
  //   return hexColors;
  // }

  // function interpolateColor(lowerColor, upperColor, factor) {
  //   const lowerColorArray = [];
  //   lowerColorArray.push(parseInt(lowerColor.substring(1, 3), 16));
  //   lowerColorArray.push(parseInt(lowerColor.substring(3, 5), 16));
  //   lowerColorArray.push(parseInt(lowerColor.substring(5, 7), 16));

  //   const upperColorArray = [];
  //   upperColorArray.push(parseInt(upperColor.substring(1, 3), 16));
  //   upperColorArray.push(parseInt(upperColor.substring(3, 5), 16));
  //   upperColorArray.push(parseInt(upperColor.substring(5, 7), 16));

  //   const interpolatedColorArray = [];
  //   for (let i = 0; i < 3; i++) {
  //     interpolatedColorArray.push(
  //       Math.round(
  //         lowerColorArray[i] +
  //           factor * (upperColorArray[i] - lowerColorArray[i])
  //       )
  //     );
  //   }

  //   let interpolatedColor = "#";
  //   for (let i = 0; i < 3; i++) {
  //     const hex = interpolatedColorArray[i].toString(16).padStart(2, "0");
  //     interpolatedColor += hex;
  //   }
  //   return interpolatedColor;
  // }
  // let colours = getHexColors();
</script>

<div >
  <div class="legendtitle">Connectivity score</div>
  <div class="legend">
    {#each nipy_spectral_100 as colour}
      <div
        class="square"
        style="background-color: {colour}; opacity: {tileOpacity / 100};"
      />
    {/each}
  </div>

  <div class="numberline">
    {#each paddedNumbers as number}
      <div class="numbers">
        {number}
      </div>
    {/each}
  </div>
</div>

<style>
  .legendtitle {
    font-size: 1.2rem;
    padding-bottom: 10px; /* Adjust the value as needed */
  }
  .legend {
    display: flex;
    border: 1px solid black;
  }
  .numberline {
    display: flex;
  }
  .square {
    width: 5px;
    height: 40px;
    /* border-right: 1px solid black; */
  }

  .numbers {
    width: 37px;
    height: 10px;
    color: black;
    opacity: 1;
    font-size: 1rem;
  }
  

</style>
