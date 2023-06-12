const squareInfoEndpt = "https://815d-35-189-123-220.ngrok-free.app";
const floodfillEndpt = "https://11af-35-189-123-220.ngrok-free.app";
const hoverScoresEndpt = "https://00dc-34-89-73-233.ngrok-free.app"

export const snapAPIEndpt = "https://7480-34-89-73-233.eu.ngrok.io";

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

export async function getHoverScores(squareID) {
  let resp;
  resp = await fetch(hoverScoresEndpt, {
    method: "POST",
    headers: jsonRequestHeaders(),
    body: JSON.stringify({ "square_ID": squareID }),
  });
  return await resp.json();
}

function jsonRequestHeaders() {
  return {
    "Bypass-Tunnel-Reminder": "haha",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };
}
