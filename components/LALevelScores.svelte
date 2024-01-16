<script>
  import proj4 from "proj4";
  import { onMount, onDestroy, getContext } from "svelte";
  import { getLABinnedScores, getLAOutlineAndCoords } from "../api.js";

  const { getMap } = getContext("map");

  const map = getMap();

  // configuration for lat/long -> OSGB easting northing conversion
  var osgb =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs";
  var wgs84 = "+proj=longlat +ellps=WGS84 +towgs84=0,0,0 +no_defs";

  const source = "LASquares";
  const layer = "LASquaresLayer";
  const LAOutlineSource = "LAOutlineSource";
  const LAOutlineLayer = "LAOutlineLayer";

  export let tileOpacity = 50;
  export let tileSettings;
  export let hoverDecile = null;

  let LAScores = {};
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
    map.addSource(LAOutlineSource, { type: "geojson", data: emptyGeojson() });
  });
  onDestroy(() => {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    if (map.getLayer(LAOutlineLayer)) {
      map.removeLayer(LAOutlineLayer);
    }
    if (map.getSource(source)) {
      map.removeSource(source);
    }
    if (map.getSource(LAOutlineSource)) {
      map.removeSource(LAOutlineSource);
    }
  });

    // if just tile level changes then add or remove layer
  // let levelToggle;
  // $: {
  //   levelToggle = tileSettings["level"];
  // }
  // let tileToggleOnOff;
  // $: {
  //   tileToggleOnOff = tileSettings["toggle"];
  // }
  // $: {
  //   if (levelToggle == "National" || selectedLA == "Hide" || !tileToggleOnOff) {
  //     if (map.getLayer(layer)) {
  //       map.removeLayer(layer);
  //     }
  //   } else {
  //     setLayer();
  //   }
  // }


  // if LA changes, load new LA scores and set on map
  let selectedLA;
  let selectedMode;
  let selectedPurpose;
  let selectedLevel;
  let tileToggleOnOff;
  $: {
    selectedLA = tileSettings["LA"];
    selectedMode = tileSettings["mode"];
    selectedPurpose = tileSettings["purpose"];
    selectedLevel = tileSettings["level"];
    tileToggleOnOff = tileSettings["toggle"];
  }


  function ifNeedNewScores() {
    if (tileToggleOnOff) {
      if (LAScores.LA != selectedLA || LAScores.mode != selectedMode || LAScores.purpose != selectedPurpose) {
        loadNewLAScores();
      } else {
        setLayer()
      }
    }
  }

  $: {
    if (selectedLevel == "National") {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    } else {
      ifNeedNewScores();
    }
  }

  function ifLevelIsLA() {
    if (selectedLevel == "Local authority" && tileToggleOnOff) {
      loadNewLAScores();
    }
  }

  // when a change occurs in purpose or mode
  $: {
    // change in mode or purpose
    if (selectedMode || selectedPurpose) {
      ifLevelIsLA();
    }
  }

  // when selecting a new LA
  $: {
    if (selectedLA != "Hide") {
      loadOutlineAndCoords();
      ifLevelIsLA();
    } else {
      if (map.getLayer(LAOutlineLayer)) {
        map.removeLayer(LAOutlineLayer);
      }
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  }

  // when toggle tiles on/off
  $: {
    if (tileToggleOnOff) {
      ifNeedNewScores();
    } else {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  }

  // on opacity changes, just reset layer
  $: {
    if (geoJson && tileOpacity) {
      setLayer();
    }
  }

  async function loadOutlineAndCoords() {
    let response = await getLAOutlineAndCoords(tileSettings);
    createOutlineGeojson(response["LA_outline"]);
    setOutlineLayer();
    map.jumpTo({
      center: response["centroid"],
      zoom: 11,
    });
  }

  async function loadNewLAScores() {
    // tileSettings["level"] = "Local authority";
    console.log("Loading LA scores for:", tileSettings["LA"]);
    // TODO add mode and purpose selection for LA scores
    let response = await getLABinnedScores(tileSettings);
    if (response == "LA not in LA list") {
    } else {
      // createOutlineGeojson(response["LA_outline"]);
      // setOutlineLayer();
      LAScores["scores"] = response["scores"];
      LAScores["LA"] = tileSettings["LA"];
      LAScores["mode"] = tileSettings["mode"];
      LAScores["purpose"] = tileSettings["purpose"];
      // map.jumpTo({
      //   center: response["centroid"],
      //   zoom: 12,
      // });
      geoJson = createSquareGeojson();
      map.getSource(source).setData(geoJson);
      setLayer();
    }
  }

  // when hovering shows LA decile
  map.on("mousemove", async function (e) {
    if (tileSettings["level"] == "Local authority" && LAScores.scores) {
      if (LAScores.scores) {
         // convert to EN
        let ll = [[e.lngLat.lng, e.lngLat.lat]];
        let ENCoords = ll.map((coords) =>
          proj4(wgs84, osgb, coords)
        );
        let centroid = `${(Math.floor(ENCoords[0][0] / 100) * 100) + 50}_${(Math.floor(ENCoords[0][1] / 100) * 100) + 50}`;
        hoverDecile = LAScores.scores[centroid];
        if (hoverDecile == undefined) {
          hoverDecile = null;
        }
      }
    }
  });

  function createLLCoords(scores) {
    // create longlat coordinates from the squareID
    let squareENCoordinates = [];
    let squareLADeciles = [];
    Object.entries(scores).forEach(
      ([squareCentroid, squareLADecile]) => {
        let [centroidEasting, centroidNorthing] = squareCentroid
          .split("_")
          .map(Number);
        squareENCoordinates.push([
          [centroidEasting - 50, centroidNorthing - 50],
          [centroidEasting + 50, centroidNorthing - 50],
          [centroidEasting + 50, centroidNorthing + 50],
          [centroidEasting - 50, centroidNorthing + 50],
        ]);
        squareLADeciles.push(squareLADecile);
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
    return [squareLLCoordinates, squareLADeciles];
  }

  function createSquareGeojson() {
    // TODO: Add check so doesn't rerun on on already calculated scores
    // find square coords in LL format and custom weighted scores
    let [squareLLCoordinates, squareScores] = createLLCoords(LAScores.scores);
    let geojson = emptyGeojson();

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
            scoreGroup: squareScores[i],
          },
        });
      }
    } else {
      console.log("Uneven lengths of coordinates and weighted scores");
    }
    return geojson;
  }

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    let beforeID = null;
    if (map.getLayer("editing-lines")) {
      // add below editing-lines
      beforeID = "editing-lines";
    }
    // if (LAScoreLayer !== "Hide") {
    if (tileSettings["level"] == "Local authority") {
      map.addLayer(
        {
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
  function setOutlineLayer() {
    if (map.getLayer(LAOutlineLayer)) {
      map.removeLayer(LAOutlineLayer);
    }

    let beforeID = null;
    if (map.getLayer("bus_layer")) {
      // add below bus_layer
      beforeID = "bus_layer";
    }
    if (tileSettings["LA"] !== "Hide") {
      map.addLayer(
        {
          id: LAOutlineLayer,
          source: LAOutlineSource,
          type: "line",
          filter: ["all", ["==", "$type", "LineString"], ["==", "name", "outline"]],
          paint: {
            "line-color": "#000000",
            "line-width": 1,
          },
        },
        beforeID
      );
      console.log("set outline layer");
    }
  }
  function createOutlineGeojson(outlineShapes) {
    let gj = emptyGeojson();
    for (let i = 0; i < outlineShapes.length; i++) {
      gj.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: outlineShapes[i],
        },
        properties: {
          name: "outline",
        },
      });
    }
    map.getSource(LAOutlineSource).setData(gj);
    return;
  }

</script>

<style>
</style>
