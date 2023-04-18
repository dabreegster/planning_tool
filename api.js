const planningGeoJsonAPIEndpt = "https://917a-34-89-73-233.eu.ngrok.io";
export const snapAPIEndpt = "https://7480-34-89-73-233.eu.ngrok.io";

// Takes a payload from  and returns the response
export async function callApi(req) {
  const resp = await fetch(planningGeoJsonAPIEndpt, {
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
