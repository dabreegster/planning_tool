const endpt = "https://cloudfunc-to-apis-y3gbqriuaq-nw.a.run.app";
// const endpt = "https://flask-app-cors-test-y3gbqriuaq-nw.a.run.app"

// Takes lat, lng and gives UserInputJSON for floodfillEndpt
export async function getSquareInfo(req) {
  const resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("squareInfo"),
    body: JSON.stringify(req),
  });
  return await resp.json();
}

export async function callFloodfillApi(req) {
  const resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("floodfill"),
    body: JSON.stringify(req),
  });
  return await resp.json();
}

export async function lookupPostcode(postcode) {
  console.log(jsonRequestHeaders("snap"))
  let resp;
  resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("snap"),
    body: JSON.stringify({ postcodeToSearch: postcode }),
  });
  return await resp.json();
}

export async function getHoverScores(squareID, mode, purpose) {
  let resp;
  resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("hoverScores"),
    body: JSON.stringify({ square_ID: squareID, modeType: mode , purpose: purpose}),
  });
  return await resp.json();
}

export async function getSquareScore(squareID) {
  let resp;
  resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("hoverScores"),
    body: JSON.stringify({ square_ID: squareID, modeType: "All" }),
  });
  return await resp.json();
}

export async function getLABinnedScores(LA_name) {
  let resp;
  resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("LAScores"),
    body: JSON.stringify({ LA_name: LA_name }),
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
  const resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("recalculatePlanning"),
    body: JSON.stringify(req),
  });
  return await resp.json();
}

export async function lookupPTRoute(feature) {
  let resp;
  resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("snap"),
    body: JSON.stringify(feature),
  });
  return await resp.json();
}

export async function lookupPathway(feature) {
  let resp;
  resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("snap"),
    body: JSON.stringify(feature),
  });
  const result = await resp.json();
  feature.geometry.coordinates = result.geometry.coordinates;
}

export async function callPDFDownload(infoForPDF) {
  const resp = await fetch(endpt, {
    method: "POST",
    headers: jsonRequestHeaders("PDF"),
    body: JSON.stringify(infoForPDF),
  });
  return await resp;
}

function jsonRequestHeaders(APIcode) {
  return {
    "Bypass-Tunnel-Reminder": "haha",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Authtoken": "TOKEN",
    "API": APIcode,
  };
}

const autofillBusEndpt = "https://d714-34-89-73-233.ngrok-free.app";

export async function callAutofillBus(req) {
  const resp = await fetch(autofillBusEndpt, {
    method: "POST",
    headers: jsonRequestHeaders("autofill"),
    body: JSON.stringify(req),
  });
  return await resp.json();
}


// const squareInfoEndpt = "https://a147-35-242-177-130.ngrok-free.app";
// const floodfillEndpt = "https://cec0-35-242-177-130.ngrok-free.app";
// const scoreCalculationEndpt = "https://7eae-34-89-73-233.ngrok-free.app";
// const scoresEndpt = "https://83ba-34-147-177-92.ngrok-free.app";
// const PDFEndpt = "https://5dbd-34-147-177-92.ngrok-free.app";
// const LAEndpt = "https://61a9-34-147-177-92.ngrok-free.app";

// export const snapAPIEndpt = "https://e69b-34-89-73-233.ngrok-free.app";

// // Takes lat, lng and gives UserInputJSON for floodfillEndpt
// export async function getSquareInfo(req) {
//   const resp = await fetch(squareInfoEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders(),
//     body: JSON.stringify(req),
//   });
//   return await resp.json();
// }

// export async function callFloodfillApi(req) {
//   const resp = await fetch(floodfillEndpt + "/floodfill_pt/", {
//     method: "POST",
//     headers: jsonRequestHeaders(),
//     body: JSON.stringify(req),
//   });
//   return await resp.json();
// }

// export async function lookupPostcode(postcode) {
//   let resp;
//   resp = await fetch(snapAPIEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders("snap"),
//     body: JSON.stringify({ postcodeToSearch: postcode }),
//   });
//   return await resp.json();
// }

// export async function getHoverScores(squareID, mode, purpose) {
//   let resp;
//   resp = await fetch(scoresEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders(),
//     body: JSON.stringify({ square_ID: squareID, modeType: mode , purpose: purpose}),
//   });
//   return await resp.json();
// }

// export async function getSquareScore(squareID) {
//   let resp;
//   resp = await fetch(scoresEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders(),
//     body: JSON.stringify({ square_ID: squareID, modeType: "All" }),
//   });
//   return await resp.json();
// }

// export async function getLABinnedScores(LA_name) {
//   let resp;
//   resp = await fetch(LAEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders(),
//     body: JSON.stringify({ LA_name: LA_name }),
//   });
//   return await resp.json();
// }

// // Takes the GeoJSON features and creates the API request. Has the side effect
// // of calling the stop lookup API.
// export async function geojsonToApiPayload(features, login_username) {
//   // set starting values for new_routes_dict indexing
//   let key = 0;
//   let route_number = 0;

//   // Fill out this new routes dictionary
//   let new_routes = {
//     route_number: {},
//     trip_id: {},
//     ATCO: {},
//     stop_sequence: {},
//     arrival_times: {},
//     departure_times: {},
//   };
//   // Fill out this request payload
//   let req = {
//     username: login_username,
//     new_routes_dict: new_routes,
//     square_ids: [],
//   };

//   // Add stored features to payload
//   for (let feature of features) {
//     if (feature.geometry.type == "Polygon") {
//       // polygon
//       for (var i = 0; i < feature.properties.squareIDs.length; i++) {
//         let squareIDs = feature.properties.squareIDs;
//         req.square_ids.push(squareIDs[i]);
//       }
//     } else if (feature.properties.from_csv) {
//       let rows = feature.properties.rows;
//       for (var i = 0; i < rows.length; i++) {
//         req.new_routes_dict.route_number[key] = route_number;
//         req.new_routes_dict.trip_id[key] = parseInt(rows[i].trip_id);
//         req.new_routes_dict.ATCO[key] = rows[i].ATCO;
//         req.new_routes_dict.stop_sequence[key] = parseInt(
//           rows[i].stop_sequence
//         );
//         req.new_routes_dict.arrival_times[key] = parseInt(
//           rows[i].arrival_times
//         );
//         req.new_routes_dict.departure_times[key] = parseInt(
//           rows[i].departure_times
//         );
//         key += 1;
//       }
//       route_number += 1;
//     } else {
//       let {
//         fullatcoCodes,
//         fullArrivalTimes,
//         fullDepartureTimes,
//         number_of_stops,
//       } = findArrivalAndDepartureTimes(feature);
//       let n = fullatcoCodes.length;

//       for (var i = 0; i < n; i++) {
//         req.new_routes_dict.route_number[key] = route_number;
//         req.new_routes_dict.trip_id[key] = Math.floor(i / number_of_stops);
//         req.new_routes_dict.ATCO[key] = fullatcoCodes[i];
//         req.new_routes_dict.stop_sequence[key] = i % number_of_stops;
//         req.new_routes_dict.arrival_times[key] = fullArrivalTimes[i];
//         req.new_routes_dict.departure_times[key] = fullDepartureTimes[i];
//         key += 1;
//       }
//       route_number += 1;
//     }
//   }
//   return req;
// }

// function findArrivalAndDepartureTimes(feature) {
//   let dailyTrips = feature.properties.dailyTrips;
//   let timeBetweenTrips = feature.properties.frequency * 60;
//   let number_of_stops = feature.geometry.coordinates.length;
//   let atcoCodes = feature.properties.ATCO;
//   let departureTimes = feature.properties.departureTime;
//   let arrivalTimes = feature.properties.arrivalTime;

//   let fullArrivalTimes = [];
//   let fullDepartureTimes = [];
//   let fullatcoCodes = [];

//   if (dailyTrips == null) {
//     dailyTrips = 1;
//   }

//   for (var trip = 0; trip < dailyTrips; trip++) {
//     for (var stop = 0; stop < number_of_stops; stop++) {
//       fullatcoCodes.push(atcoCodes[stop]);
//       if (arrivalTimes[stop] == "First stop") {
//         fullArrivalTimes.push(
//           covertTimeStringToSPM(departureTimes[stop]) + timeBetweenTrips * trip
//         );
//         fullDepartureTimes.push(
//           covertTimeStringToSPM(departureTimes[stop]) + timeBetweenTrips * trip
//         );
//       } else if (departureTimes[stop] == "Last stop") {
//         fullArrivalTimes.push(
//           covertTimeStringToSPM(arrivalTimes[stop]) + timeBetweenTrips * trip
//         );
//         fullDepartureTimes.push(
//           covertTimeStringToSPM(arrivalTimes[stop]) + timeBetweenTrips * trip
//         );
//       } else {
//         fullArrivalTimes.push(
//           covertTimeStringToSPM(arrivalTimes[stop]) + timeBetweenTrips * trip
//         );
//         fullDepartureTimes.push(
//           covertTimeStringToSPM(departureTimes[stop]) + timeBetweenTrips * trip
//         );
//       }
//     }
//   }
//   return {
//     fullatcoCodes,
//     fullArrivalTimes,
//     fullDepartureTimes,
//     number_of_stops,
//   };
// }
// function covertTimeStringToSPM(timeString) {
//   let secondsPastMidnight = 0;
//   secondsPastMidnight += parseInt(timeString.split(":")[0]) * 3600;
//   secondsPastMidnight += parseInt(timeString.split(":")[1]) * 60;
//   secondsPastMidnight += parseInt(timeString.split(":")[2]);
//   return secondsPastMidnight;
// }
// // Takes a payload from geojsonToApiPayload and returns the response
// export async function callApi(req) {
//   const resp = await fetch(scoreCalculationEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders(),
//     body: JSON.stringify(req),
//   });
//   return await resp.json();
// }

// export async function lookupPTRoute(feature) {
//   let resp;
//   resp = await fetch(snapAPIEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders(),
//     body: JSON.stringify(feature),
//   });
//   return await resp.json();
// }

// export async function lookupPathway(feature) {
//   let resp;
//   resp = await fetch(snapAPIEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders(),
//     body: JSON.stringify(feature),
//   });
//   const result = await resp.json();
//   feature.geometry.coordinates = result.geometry.coordinates;
// }

// export async function callPDFDownload(infoForPDF) {
//   const resp = await fetch(PDFEndpt, {
//     method: "POST",
//     headers: jsonRequestHeaders("PDF"),
//     body: JSON.stringify(infoForPDF),
//   });
//   return await resp;
// }

// function jsonRequestHeaders(APIcode) {
//   let headers = {
//     "Bypass-Tunnel-Reminder": "haha",
//     Accept: "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Content-Type": "application/json",
//     Authtoken: "TOKEN",
//     API: APIcode,
//   };
//   return headers;
// }

// // function jsonRequestHeaders(APIcode) {
// //   return {
// //     "Bypass-Tunnel-Reminder": "haha",
// //     Accept: "application/json",
// //     "Access-Control-Allow-Origin": "*",
// //     "Content-Type": "application/json",
// //     "Authtoken": "TOKEN",
// //     "API": APIcode,
// //   };
// // }
