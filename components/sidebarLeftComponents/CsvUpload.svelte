<script>
  import length from "@turf/length";
  import { gjScheme } from "../../stores.js";
  import naptanLookup from "../../data/NaPTAN_stops_latlong.json";
  import csvExampleUrl from "../../data/csv_example.csv?url";
  import csvTemplateUrl from "../../data/csv_template.csv?url";

  function downloadCsvExampleAndTemplate() {
    const link = document.createElement("a");
    link.href = csvExampleUrl;
    link.download = "csv_example.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    link.href = csvTemplateUrl;
    link.download = "csv_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function loadFile(e) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        handleCsv(e.target.result);
      } catch (err) {
        window.alert(`Couldn't load CSV: ${err}`);
      }
    };
    reader.readAsText(e.target.files[0]);
  }

  // Parse CSV and return a dictionary per row, using the headers for names.
  // All values will be strings.
  // TODO Use a library for this
  function csvToObjects(csvString) {
    // Strip out Windows newlines
    let fixed = csvString.replaceAll("\r", "");
    let rows = fixed.split("\n");
    let headers = rows.shift().split(",");

    let result = [];
    for (let row of rows) {
      let obj = {};
      let i = 0;
      for (let value of row.split(",")) {
        obj[headers[i]] = value;
        i++;
      }
      result.push(obj);
    }
    return result;
  }

  function handleCsv(csvString) {
    // Group rows by route_number.
    let rows_per_route = {};
    for (let row of csvToObjects(csvString)) {
      if (!rows_per_route.hasOwnProperty(row.route_number)) {
        rows_per_route[row.route_number] = [];
      }
      rows_per_route[row.route_number].push(row);
    }

    // Create a GeoJSON feature per route
    for (let [route_number, rows] of Object.entries(rows_per_route)) {
      console.log(`for ${route_number}, we have ${JSON.stringify(rows)}`);

      // Create a line-string connecting each stop, looking up the coordinates
      let coordinates = [];
      for (let row of rows) {
        // TODO Assumptions:
        // 1) Rows are already ordered by stop_sequence
        // 2) Trips are contiguous
        // 3) Every trip per route has the same stop_sequence
        // 4) trip_id 0 exists
        if (row.trip_id != 0) {
          break;
        }
        let pt = naptanLookup[row.ATCO];
        if (pt === undefined) {
          console.log(`naptanLookup is missing ${row.ATCO}, skipping`);
          continue;
        }
        // https://macwright.com/lonlat/
        coordinates.push([pt[1], pt[0]]);
      }

      if (coordinates.length < 2) {
        console.log(
          `Not enough points for a linestring, skipping ${JSON.stringify(rows)}`
        );
        continue;
      }

      let feature = {
        // TODO UUID?
        id: Math.random().toString(36).substr(2, 9),
        type: "Feature",
        properties: {
          from_csv: true,
          name: `Route ${route_number} from CSV upload`,
          rows,
        },
        geometry: { coordinates, type: "LineString" },
      };
      feature.properties.lengthKm = length(feature.geometry);
      gjScheme.update((gj) => {
        gj.features.push(feature);
        return gj;
      });
    }
  }
</script>

<div>
  <label>
    <input type="file" id="upload_csv" on:change={loadFile} />
    <button
      class="white_button"
      type="button"
      title="Upload a CSV of your scheme in the format shown in the example"
      onclick="document.getElementById('upload_csv').click();"
    >
      Upload scheme (CSV)
    </button>
  </label>
  <br/>
  <label>
    <input type="file" id="upload_csv" on:change={loadFile} />
    <button
      class="white_button"
      type="button"
      title="Download an example and template CSV"
      on:click={downloadCsvExampleAndTemplate}
      style = "margin-top: 5px;"
    >
      Example CSV
    </button>
  </label>
</div>
<br />

<style>
  input[type="file"] {
    cursor: pointer;

    /* Make the input type=file effectively invisible, but still let browser accessibility stuff work */
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .white_button {
    background: white;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    transition: background-color 0.05s ease-in-out;
  }
  .white_button:hover {
    background: #dfdfdf;
  }
</style>
