const BASE_URI = "https://api.ravelry.com";

const endpoint = `${BASE_URI}/patterns/1234.json`;

//인증을 위한 헤더
const headers = new Headers();
headers.append(
  "Authorization",
  "Basic " +
    btoa(
      "read-ea6b8e0a978e097b8badec466c71a60b" +
        ":" +
        "nKTdyxY5v3mF3TDb8hkQHGhHwHNQL7lbJtU8Dz15"
    )
);
//headers.append("Content-Type", "text/xml");
//headers.append("Origin", "https://api.ravelry.com");
//headers.append("Access-Control-Allow-Methods", "GET");

function button_click() {
  console.log("button clicked!");

  fetch(endpoint, { method: "GET", headers: headers })
    .then((res) => res.json())
    .then((res) => console.log(res));
}
