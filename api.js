const squareInfoEndpt = "https://815d-35-189-123-220.ngrok-free.app";
const floodfillEndpt = "https://11af-35-189-123-220.ngrok-free.app";
const hoverScoresEndpt = "https://cb89-34-147-152-157.ngrok-free.app";
const scoreCalculationEndpt = "https://917a-34-89-73-233.eu.ngrok.io";

export const snapAPIEndpt = "https://7480-34-89-73-233.eu.ngrok.io";

const testEndpt = "https://example-flask-dot-dft-dst-prt-connectivitymetric.ew.r.appspot.com/";


// Takes lat, lng and gives UserInputJSON for floodfillEndpt
export async function testAPI() {
  const resp = await fetch(testEndpt, {
    method: "GET",
    headers: jsonRequestHeaders(),
  });
  return await resp.json();
}

// Takes lat, lng and gives UserInputJSON for floodfillEndpt
export async function getSquareInfo(req) {
  const resp = await fetch(squareInfoEndpt, {
    method: "POST",
    headers: jsonRequestHeaders(),
    body: JSON.stringify(req),
  });
  return await resp.json();
}

export async function callFloodfillApi(req) {
  const resp = await fetch(floodfillEndpt + "/floodfill_pt/", {
    method: "POST",
    headers: jsonRequestHeaders(),
    body: JSON.stringify(req),
  });
  return await resp.json();
}

export async function lookupPostcode(postcode) {
  let resp;
  resp = await fetch(snapAPIEndpt, {
    method: "POST",
    headers: jsonRequestHeaders(),
    body: JSON.stringify({ postcodeToSearch: postcode }),
  });
  return await resp.json();
}

export async function getHoverScores(squareID, mode) {
  let resp;
  resp = await fetch(hoverScoresEndpt, {
    method: "POST",
    headers: jsonRequestHeaders(),
    body: JSON.stringify({ square_ID: squareID, modeType: mode }),
  });
  return await resp.json();
}

// Takes the GeoJSON features and creates the API request. Has the side effect
// of calling the stop lookup API.
export async function geojsonToApiPayload(features, login_username) {
  // set starting values for new_routes_dict indexing
  let key = 0;
  let route_number = 0;

  // Fill out this new routes dictionary
  let new_routes = {
    route_number: {},
    trip_id: {},
    ATCO: {},
    stop_sequence: {},
    arrival_times: {},
    departure_times: {},
  };
  // Fill out this request payload
  let req = {
    username: login_username,
    new_routes_dict: new_routes,
    square_ids: [],
  };

  // Add stored features to payload
  for (let feature of features) {
    if (feature.geometry.type == "Polygon") {
      // polygon
      for (var i = 0; i < feature.properties.squareIDs.length; i++) {
        let squareIDs = feature.properties.squareIDs;
        req.square_ids.push(squareIDs[i]);
      }
    } else if (feature.properties.from_csv) {
      let rows = feature.properties.rows;
      for (var i = 0; i < rows.length; i++) {
        req.new_routes_dict.route_number[key] = route_number;
        req.new_routes_dict.trip_id[key] = parseInt(rows[i].trip_id);
        req.new_routes_dict.ATCO[key] = rows[i].ATCO;
        req.new_routes_dict.stop_sequence[key] = parseInt(
          rows[i].stop_sequence
        );
        req.new_routes_dict.arrival_times[key] = parseInt(
          rows[i].arrival_times
        );
        req.new_routes_dict.departure_times[key] = parseInt(
          rows[i].departure_times
        );
        key += 1;
      }
      route_number += 1;
    } else {
      let {
        fullatcoCodes,
        fullArrivalTimes,
        fullDepartureTimes,
        number_of_stops,
      } = findArrivalAndDepartureTimes(feature);
      let n = fullatcoCodes.length;

      for (var i = 0; i < n; i++) {
        req.new_routes_dict.route_number[key] = route_number;
        req.new_routes_dict.trip_id[key] = Math.floor(i / number_of_stops);
        req.new_routes_dict.ATCO[key] = fullatcoCodes[i];
        req.new_routes_dict.stop_sequence[key] = i % number_of_stops;
        req.new_routes_dict.arrival_times[key] = fullArrivalTimes[i];
        req.new_routes_dict.departure_times[key] = fullDepartureTimes[i];
        key += 1;
      }
      route_number += 1;
    }
  }
  return req;
}

function findArrivalAndDepartureTimes(feature) {
  let dailyTrips = feature.properties.dailyTrips;
  let timeBetweenTrips = feature.properties.frequency * 60;
  let number_of_stops = feature.geometry.coordinates.length;
  let atcoCodes = feature.properties.ATCO;
  let departureTimes = feature.properties.departureTime;
  let arrivalTimes = feature.properties.arrivalTime;

  let fullArrivalTimes = [];
  let fullDepartureTimes = [];
  let fullatcoCodes = [];

  if (dailyTrips == null) {
    dailyTrips = 1;
  }

  for (var trip = 0; trip < dailyTrips; trip++) {
    for (var stop = 0; stop < number_of_stops; stop++) {
      fullatcoCodes.push(atcoCodes[stop]);
      if (arrivalTimes[stop] == "First stop") {
        fullArrivalTimes.push(
          covertTimeStringToSPM(departureTimes[stop]) + timeBetweenTrips * trip
        );
        fullDepartureTimes.push(
          covertTimeStringToSPM(departureTimes[stop]) + timeBetweenTrips * trip
        );
      } else if (departureTimes[stop] == "Last stop") {
        fullArrivalTimes.push(
          covertTimeStringToSPM(arrivalTimes[stop]) + timeBetweenTrips * trip
        );
        fullDepartureTimes.push(
          covertTimeStringToSPM(arrivalTimes[stop]) + timeBetweenTrips * trip
        );
      } else {
        fullArrivalTimes.push(
          covertTimeStringToSPM(arrivalTimes[stop]) + timeBetweenTrips * trip
        );
        fullDepartureTimes.push(
          covertTimeStringToSPM(departureTimes[stop]) + timeBetweenTrips * trip
        );
      }
    }
  }
  return {
    fullatcoCodes,
    fullArrivalTimes,
    fullDepartureTimes,
    number_of_stops,
  };
}
function covertTimeStringToSPM(timeString) {
  let secondsPastMidnight = 0;
  secondsPastMidnight += parseInt(timeString.split(":")[0]) * 3600;
  secondsPastMidnight += parseInt(timeString.split(":")[1]) * 60;
  secondsPastMidnight += parseInt(timeString.split(":")[2]);
  return secondsPastMidnight;
}
// Takes a payload from geojsonToApiPayload and returns the response
export async function callApi(req) {
  const resp = await fetch(scoreCalculationEndpt, {
    method: "POST",
    headers: jsonRequestHeaders(),
    body: JSON.stringify(req),
  });
  return await resp.json();
}

export async function lookupPTRoute(feature) {
  let resp;
  resp = await fetch(snapAPIEndpt, {
    method: "POST",
    headers: jsonRequestHeaders(),
    body: JSON.stringify(feature),
  });
  const result = await resp.json();
  feature.geometry.coordinates = result.geometry.coordinates;
  feature.properties.ptMode = result.properties.ptMode;
  feature.properties.ATCO = result.properties.ATCO;
  feature.properties.arrivalTime = ["First stop"].concat(
    Array(feature.properties.ATCO.length - 1).fill("not_set")
  );
  feature.properties.departureTime = Array(feature.properties.ATCO.length - 1)
    .fill("not_set")
    .concat("Last stop");
}

export async function lookupPathway(feature) {
  let resp;
  resp = await fetch(snapAPIEndpt, {
    method: "POST",
    headers: jsonRequestHeaders(),
    body: JSON.stringify(feature),
  });
  const result = await resp.json();
  feature.geometry.coordinates = result.geometry.coordinates;
}

function jsonRequestHeaders() {
  return {
    "Bypass-Tunnel-Reminder": "haha",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };
}
