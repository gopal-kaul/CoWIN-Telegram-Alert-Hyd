// Hyd districtID = 581
const axios = require("axios");
const dotenv = require("dotenv").config();
let data = [];
const centressent = [];
const url = `https://api.telegram.org/bot${process.env.APIKey}/sendMessage?chat_id=@${process.env.ChannelName}&text=`;
const fetchdata = async () => {
  let date = new Date();
  await axios
    .get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${
        process.env.DistrictID
      }&date=${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    )
    .then((resp) => {
      data = resp.data["sessions"];
    })
    .catch((e) => console.log(`Error : ${e}`));
  let centres = [];
  for (let i = 0; i < data.length; ++i) {
    if (
      data[i]["available_capacity_dose1"] != 0 &&
      data[i]["available_capacity_dose2"] != 0
    )
      centres.push(data[i]);
  }
  for (let i = 0; i < centres.length; ++i) {
    if (centressent.includes(centres[i]) == false) {
      await axios
        .get(
          `${url}Centre%20Name%20:%20${
            centres[i]["name"]
          }%0AFirst%20Dose%20Capacity%20:%20${
            centres[i]["available_capacity_dose1"]
          }%0ASecond%20Dose%20Capacity%20:%20${
            centres[i]["available_capacity_dose1"]
          }
          %0AType%20:%20${
            centres[i]["fee_type"]
          }%0ADate%20:%20${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`
        )
        .then(() => new Promise((resolve) => setTimeout(resolve, 2000))) // to add delay to every API call
        .catch((e) => console.log(`Error in sending messages : ${e}`));
      centressent.push(centres[i]);
    }
  }
};
fetchdata();
setInterval(fetchdata, 300000);
