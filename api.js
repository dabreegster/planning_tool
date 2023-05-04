const squareInfoEndpt = "https://917a-34-89-73-233.eu.ngrok.io";
const floodfillEndpt = "https://2a5c-35-242-173-146.ngrok-free.app"; // new floodfill
// const floodfillEndpt = "https://3b19-35-246-27-146.ngrok-free.app";

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

function jsonRequestHeaders() {
  return {
    "Bypass-Tunnel-Reminder": "haha",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };
}
