// --------------------------------------------------------------------------------
function UpdateDataTableValues() {
  let rowCount = document.getElementById("row_count").innerHTML;
  for (let i = 1; i < rowCount; i++) {
    {
      try {
        let sID = "row_" + i;
        let sJSON = document.getElementById("json_" + sID).innerHTML;
        // let jJSON = sJSON.replaceAll("'",'"')
        let oJSON = JSON.parse(sJSON);
        let sRowValueID = "value_" + sID;
        document.getElementById(sRowValueID).innerHTML = oJSON.value;
        let sRowTitleID = "title_" + sID;
        document.getElementById(sRowTitleID).innerHTML = oJSON.title;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

// --------------------------------------------------------------------------------

function UpdateTrendChart() {
  //https://www.chartjs.org/docs/latest/getting-started/usage.html
  const host = window.location.host;
 
  const pvoKey = document.getElementById("pvo_title").value// "Temperature";
  const chart_type = document.getElementById("chart_type").value// "line";
  var startDate = document.getElementById("myStartDate").value; //'2024-02-05 20:18:44';
  var stopDate = document.getElementById("myStopDate").value;
  //const xValues = [100,200,300,400,500,600,700,800,900,1000]; //for testing
  // const yData= [860,1140,1060,1060,1070,1110,1330,2210,7830,2478]; //for testing

  startDate = startDate.replace("T", " ");
  stopDate = stopDate.replace("T", " ");
  chart_type 
  const apiUrl =
    "http://"+ host + "/data/read?pvoKey=" +
    pvoKey +
    "&StartDate=" +
    startDate +
    "&StopDate=" +
    stopDate;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Data not found");
        } else if (response.status === 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Network response was not ok");
        }
      }
      return response.json();
    })
    .then((data) => {
      //var sJson = JSON.stringify(data, null, 2);
      var jData = data;
      const xValues = [];
      const yData = [];
      for (let i in jData) {
        xValues.push(jData[i].EventDate);
        yData.push(jData[i].Value);
      }

      new Chart("myChart", {
        type: chart_type,
        data: {
          labels: xValues,
          datasets: [
            {
              label: jData[0].Title,
              data: yData,
              borderColor: "red",
              fill: false,
            },
          ],
        },
        options: {
          legend: { display: true },
        },
      });
      return sJson;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// --------------------------------------------------------------------------------
function Update_Overview() {
  const currentUrl = window.location.href;
  
  const apiUrl = currentUrl +"/list/read";
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Data not found");
        } else if (response.status === 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Network response was not ok");
        }
      }
      return response.json();
    })
    .then((data) => {
      var sJson = JSON.stringify(data, null, 2);
      //var data = JSON.parse(this.response);
      data.forEach((pvo) => {
        jData = JSON.parse(pvo.jData);
        if (jData.title == "Temperature") {
          document.getElementById("Temperature").innerHTML = jData.value;
        }
        if (jData.title == "Volume") {
          document.getElementById("Volume").innerHTML = jData.value;
        }
        if (jData.title == "Agitator") {
          document.getElementById("Agitator").innerHTML = jData.value;
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//-----------------------------------------------------------------------------
function Start_Agitator() {
  Call_Trigger_API(3, 1);
}
//-----------------------------------------------------------------------------
function Stop_Agitator() {
  Call_Trigger_API(4, 1);
}
//-----------------------------------------------------------------------------
function Start_Batch() {
  Call_Trigger_API(1, 1);
}

//-----------------------------------------------------------------------------
function Stop_Batch() {
  Call_Trigger_API(2, 1);
}
//-----------------------------------------------------------------------------
function Call_Trigger_API(index, value) {

  const currentUrl = window.location.href;

  const apiUrl = currentUrl +"trigger/set?index=" + index + "&value=" + value;
  const data = {
    name: "Not Used",
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("API not found");
        } else if (response.status === 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Network response was not ok");
        }
      }
      return response.json();
    })
    .then((data) => {
      console.log("Start Agitator:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//-----------------------------------------------------------------------------
function Call_GetTrendData_API(pvoKey, startDate, stopDate) {
  const host = window.location.host;
  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  const apiUrl =
    "http://127.0.0.1:8080/data/read?pvoKey=" +
    pvoKey +
    "&StartDate=" +
    startDate +
    "&StopDate=" +
    stopDate;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Data not found");
        } else if (response.status === 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Network response was not ok");
        }
      }
      return response.json();
    })
    .then((data) => {
      var sJson = JSON.stringify(data, null, 2);

      return sJson;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
