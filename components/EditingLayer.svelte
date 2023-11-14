<script>
  import { onMount, getContext } from "svelte";
  import geojsonExtent from "@mapbox/geojson-extent";
  import {
    drawLine,
    isPolygon,
    isLine,
    drawPolygon,
  } from "../style.js";
  import { emptyGeojson } from "../stores.js";
  import { gjScheme, currentlyEditing } from "../stores.js";

  const { getMap } = getContext("map");

  let source = "editing";
  let color = "#EE7C0E";
  let lineWidth = 5;

  onMount(() => {
    const map = getMap();

    map.addSource(source, {
      type: "geojson",
      data: emptyGeojson(),
    });

    map.addLayer({
      id: "editing-polygons",
      source: source,
      filter: isPolygon,
      ...drawPolygon(color, 0),
    });
    let beforeID = null;
    if (map.getLayer("base-line.cold")) {
      beforeID = "base-line.cold";
    }
    map.addLayer(
      {
        id: "editing-lines",
        source: source,
        filter: isLine,
        ...drawLine(color, 1.5 * lineWidth),
      },
      beforeID,
    );

    gjScheme.subscribe((gj) => {
      map
        .getSource(source)
        .setData(
          gj.features.find((f) => f.properties.editing) || emptyGeojson()
        );
    });

    // Warp to what's being edited
    // TODO This is a bit annoying when clicking on the map. Can we limit to just the sidebar?
    currentlyEditing.subscribe((id) => {
      if (id) {
        // currentlyEditing only changes when the ID changes, not
        // properties/geometry, so that this behavior isn't triggered
        // constantly
        let feature = $gjScheme.features.find((f) => f.id == id);

        if (feature.geometry.type == "Point") {
          map.flyTo({ center: feature.geometry.coordinates });
        } else {
          map.fitBounds(geojsonExtent(feature), {
            padding: 200,
            animate: true,
            duration: 500,
          });
        }
      }
    });
  });
</script>
