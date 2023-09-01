<script>
  import Slider from "@bulatdashiev/svelte-slider";

  export let weights = {
    business: 70,
    education: 70,
    entertainment: 70,
    health: 70,
    shopping: 70,
    residential: 70,
  };
  export let squareScores = null;

  function updateWithNewWeights(squareScores) {
    if (squareScores === null) {
      return squareScores;
    }
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
  let business = [32];
  let education = [19];
  let entertainment = [11];
  let health = [3];
  let shopping = [27];
  let residential = [8];

  function updateWeights(
    business,
    education,
    entertainment,
    health,
    shopping,
    residential
  ) {
    weights["business"] = business[0];
    weights["education"] = education[0];
    weights["entertainment"] = entertainment[0];
    weights["health"] = health[0];
    weights["shopping"] = shopping[0];
    weights["residential"] = residential[0];
    squareScores = updateWithNewWeights(squareScores);
    return weights;
  }

  $: {
    weights = updateWeights(
      business,
      education,
      entertainment,
      health,
      shopping,
      residential
    );
  }
</script>
<div style="font-size: 16px;">
  Business: {business[0]}
  <Slider bind:value={business} />
</div>
<div style="font-size: 16px;">
  Education: {education[0]}
  <Slider bind:value={education} />
</div>
<div style="font-size: 16px;">
  Entertainment: {entertainment[0]}
  <Slider bind:value={entertainment} />
</div>
<div style="font-size: 16px;">
  Health: {health[0]}
  <Slider bind:value={health} />
</div>
<div style="font-size: 16px;">
  Shopping: {shopping[0]}
  <Slider bind:value={shopping} />
</div>
<div style="font-size: 16px;">
  Residential: {residential[0]}
  <Slider bind:value={residential} />
</div>

<style>

</style>
