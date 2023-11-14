<script>
  import proj4 from "proj4";
  import { onMount, onDestroy, getContext } from "svelte";
  import { getLABinnedScores } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  // configuration for lat/long -> OSGB easting northing conversion
  var osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs";
  var wgs84 = "+proj=longlat +ellps=WGS84 +towgs84=0,0,0 +no_defs";

  const source = "LASquares";
  const layer = "LASquaresLayer";

  export let tileOpacity = 50;
  export let tileSettings;

  let LAScores = null;

  let geoJson = null;

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

  function emptyGeojson() {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  onMount(() => {
    map.addSource(source, { type: "geojson", data: emptyGeojson() });
  });
  onDestroy(() => {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }

    if (map.getSource(source)) {
      map.removeSource(source);
    }
  });

  // if LA changes, load new LA scores and set on map
  let selectedLA;
  $: {
    selectedLA = tileSettings["LA"];
  }
  $: {
    if (selectedLA != "Hide") {
      loadNewLAScores();
    }
  }

  // if just tile level changes then add or remove layer
  let levelToggle
  $: {
    levelToggle = tileSettings["level"];
  }
  let tileToggleOnOff
  $: {
    tileToggleOnOff = tileSettings["toggle"];
  }
  $: {
    if (levelToggle == "National" || selectedLA == "Hide" || !tileToggleOnOff) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    } else {
      setLayer()
    }
  }

  // on opacity changes, just reset layer
  $: {
    if (geoJson && tileOpacity) {
      setLayer();
    }
  }

  async function loadNewLAScores() {
    tileSettings["level"] = "Local authority";
    console.log("Loading LA scores for:", tileSettings["LA"])
    // TODO add mode and purpose selection for LA scores
    let response = await getLABinnedScores(tileSettings["LA"]);
    if (response == "LA not in LA list") {
    } else {
      LAScores = response["scores"];
      map.jumpTo({
        center: response["centroid"],
        zoom: 12,
      });
      geoJson = createSquareGeojson();
      map.getSource(source).setData(geoJson);
      setLayer();
    }
  }

  function createLLCoords(LAScores) {
    // create longlat coordinates from the squareID
    let squareENCoordinates = [];
    let squareScores = [];
    Object.entries(LAScores).forEach(
      ([squareCentroid, scoreGroup_rawScore]) => {
        let [centroidEasting, centroidNorthing] = squareCentroid
          .split("_")
          .map(Number);
        squareENCoordinates.push([
          [centroidEasting - 50, centroidNorthing - 50],
          [centroidEasting + 50, centroidNorthing - 50],
          [centroidEasting + 50, centroidNorthing + 50],
          [centroidEasting - 50, centroidNorthing + 50],
        ]);
        squareScores.push(scoreGroup_rawScore);
      }
    );
    // flatten array
    let flatSquareENCoordinates = squareENCoordinates.flat();
    // convert to LongLat
    let flatSquareLLCoordinates = flatSquareENCoordinates.map((coords) =>
      proj4(osgb, wgs84, coords)
    );
    // renest list into 4
    let squareLLCoordinates = [];
    for (var i = 0; i < flatSquareLLCoordinates.length; i += 4) {
      let LLCoordinates = flatSquareLLCoordinates.slice(i, i + 4);
      squareLLCoordinates.push(LLCoordinates);
    }
    return [squareLLCoordinates, squareScores];
  }

  function createSquareGeojson() {
    // TODO: Add check so doesn't rerun on on already calculated scores
    // find square coords in LL format and custom weighted scores
    let [squareLLCoordinates, squareScores] = createLLCoords(LAScores);
    let geojson = emptyGeojson();
    console.log(squareScores);

    // assert they are of equal length
    if (squareLLCoordinates.length == squareScores.length) {
      // if so then create geojson of scores
      for (let i = 0; i < squareLLCoordinates.length; i++) {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [squareLLCoordinates[i]],
          },
          properties: {
            scoreGroup: squareScores[i][0],
            rawScore: squareScores[i][1],
          },
        });
      }
    } else {
      console.log("Uneven lengths of coordinates and weighted scores");
    }
    console.log(geojson);
    return geojson;
  }

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    let beforeID = null;
    if (map.getLayer("base-line.cold")) {
      // add below base-line.cold
      beforeID = "base-line.cold";
    }
    // if (LAScoreLayer !== "Hide") {
    if (tileSettings["level"] == "Local authority") {

      map.addLayer({
        id: layer,
        source: source,
        type: "fill",
        paint: {
          "fill-color": [
            "to-color",
            ["at", ["get", "scoreGroup"], ["literal", laScoreColours]],
          ],
          "fill-outline-color": "rgba(0, 0, 0, 0.04)",
          "fill-opacity": tileOpacity / 100,
        },
      },
      beforeID
      );
      console.log("set layer");
    }
  }
</script>

<style>

</style>
