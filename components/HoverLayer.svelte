<script>
  import { onMount, getContext } from "svelte";
  import { derived } from "svelte/store";
  import {
    drawLine,
    isPolygon,
    isLine,
    drawPolygon,
  } from "../style.js";
  import { emptyGeojson } from "../stores.js";
  import { gjScheme, currentSidebarHover } from "../stores.js";

  const { getMap } = getContext("map");

  // TODO Does this need to be a store?
  const dontHover = derived(gjScheme, ($gj) =>
    $gj.features.some((f) => f.properties.editing)
  );

  let source = "hover";
  let hoverColor = "yellow";
  let lineWidth = 7;

  onMount(() => {
    const map = getMap();
    map.addSource(source, {
      type: "geojson",
      data: emptyGeojson(),
    });
    let beforeID = null;
    if (map.getLayer("base-line.cold")) {
      // add below base-line.cold
      beforeID = "base-line.cold";
    }
    map.addLayer(
      {
        id: "hover-polygons",
        source: source,
        filter: isPolygon,
        ...drawPolygon(hoverColor, 0.5),
      },
      beforeID,
      );
    map.addLayer(
      {
        id: "hover-lines",
        source: source,
        filter: isLine,
        ...drawLine(hoverColor, 1.5 * lineWidth, 1.0),
      },
      beforeID,
    );

    // Don't show hover whenever we're editing something
    dontHover.subscribe((x) => {
      if (x) {
        currentSidebarHover.set(null);
      }
    });

    currentSidebarHover.subscribe((id) => {
      if (id && !$dontHover) {
        map
          .getSource(source)
          .setData($gjScheme.features.find((f) => f.id == id));
      } else {
        map.getSource(source).setData(emptyGeojson());
      }
    });
  });
</script>
