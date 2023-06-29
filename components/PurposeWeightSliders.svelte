<script>
  import Range from "./Range.svelte";

  export let weights = {
    business: 70,
    education: 70,
    entertainment: 70,
    health: 70,
    shopping: 70,
    residential: 70,
  };
  export let squareScores;

  function updateWithNewWeights(squareScores) {
    let combinedWeight = 0;
    let weightsArray = [];
    for (let key in weights) {
      if (weights.hasOwnProperty(key)) {
        combinedWeight += weights[key];
        weightsArray.push(weights[key]);
      }
    }
    Object.entries(squareScores).forEach(([mode, _]) => {
      if (Object.keys(squareScores[mode]).length === 0) {
      } else {
        Object.entries(squareScores[mode]).forEach(([squareID, scores]) => {
          let weightedOverall = 0;
          for (let i = 0; i < 6; i++) {
            weightedOverall += Math.round(
              scores[i] * (weightsArray[i] / combinedWeight)
            );
          }
          scores[6] = weightedOverall;
          squareScores[mode][squareID] = scores;
        });
      }
    });
    return squareScores;
  }
</script>

<div class="whitebox">
  <h2>Custom weights</h2>
  <h3>
    Business: {weights["business"]}
  </h3>
  <div>
    <Range
      on:change={(e) => (weights["business"] = e.detail.value)}
      on:change={(squareScores = updateWithNewWeights(squareScores))}
      id="basic-slider"
    />
  </div>
  <h3>
    Education: {weights["education"]}
  </h3>
  <div>
    <Range
      on:change={(e) => (weights["education"] = e.detail.value)}
      on:change={(squareScores = updateWithNewWeights(squareScores))}
      id="basic-slider"
    />
  </div>
  <h3>
    Entertainment: {weights["entertainment"]}
  </h3>
  <div>
    <Range
      on:change={(e) => (weights["entertainment"] = e.detail.value)}
      on:change={(squareScores = updateWithNewWeights(squareScores))}
      id="basic-slider"
    />
  </div>
  <h3>
    Health: {weights["health"]}
  </h3>
  <div>
    <Range
      on:change={(e) => (weights["health"] = e.detail.value)}
      on:change={(squareScores = updateWithNewWeights(squareScores))}
      id="basic-slider"
    />
  </div>
  <h3>
    Shopping: {weights["shopping"]}
  </h3>
  <div>
    <Range
      on:change={(e) => (weights["shopping"] = e.detail.value)}
      on:change={(squareScores = updateWithNewWeights(squareScores))}
      id="basic-slider"
    />
  </div>
  <h3>
    Residential: {weights["residential"]}
  </h3>
  <div>
    <Range
      on:change={(e) => (weights["residential"] = e.detail.value)}
      on:change={(squareScores = updateWithNewWeights(squareScores))}
      id="basic-slider"
    />
  </div>
</div>

<style>
  h3 {
    text-align: center;
    font-size: 1.2rem;
  }
  h2 {
    text-align: left;
    font-size: 1.4rem;
  }
  .whitebox {
    background-color: white;
    position: absolute;
    width: 450px;
    padding: 16px;
    /* border-radius: 10px; */
    /* left: 10px; */
    /* top: 310px; */
    /* box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2); */
    overflow-y: auto;
    scrollbar-width: none;
  }
</style>
