
// --------------------------------------------------------------------------------
function UpdateDataTableValues(){
    let rowCount = document.getElementById("row_count").innerHTML;
    for (let i = 1; i < rowCount; i++) {
      {
        try{
       
          let sID = "row_" + i
          let sJSON = document.getElementById("json_"+ sID).innerHTML;
         // let jJSON = sJSON.replaceAll("'",'"')
          let oJSON = JSON.parse(sJSON);
          let sRowValueID = "value_" + sID
          document.getElementById(sRowValueID).innerHTML = oJSON.value;
          let sRowTitleID = "title_" + sID
          document.getElementById(sRowTitleID).innerHTML = oJSON.title;
          }
      catch (error) {
          console.log(error)
        } 
      }
    }
}

// --------------------------------------------------------------------------------

function UpdateTrendChart(){
    const xValues = [100,200,300,400,500,600,700,800,900,1000];
                    
    new Chart("myChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{ 
          data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
          borderColor: "red",
          fill: false
        }, { 
          data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
          borderColor: "green",
          fill: false
        }, { 
          data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
          borderColor: "blue",
          fill: false
        }]
      },
      options: {
        legend: {display: false}
      }
    });
}

// --------------------------------------------------------------------------------
function Update_Overview(){

  const apiUrl = 'http://127.0.0.1:8080/list/read';
  fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Data not found');
      } else if (response.status === 500) {
        throw new Error('Server error');
      } else {
        throw new Error('Network response was not ok');
      }
    }
    return response.json();
  })
  .then(data => {
    var sJson = JSON.stringify(data, null, 2);
    //var data = JSON.parse(this.response);
    data.forEach((pvo) => {
      jData = JSON.parse(pvo.jData); 
      if (jData.title == "Temperature"){
        document.getElementById("Temperature").innerHTML = jData.value;
      }
      if (jData.title == "Volume"){
        document.getElementById("Volume").innerHTML = jData.value;
      }
      if (jData.title == "Agitator"){
        document.getElementById("Agitator").innerHTML = jData.value;
      }
    })
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}
//-----------------------------------------------------------------------------
function Start_Agitator(){
  Call_Trigger_API(3,1);
}
//-----------------------------------------------------------------------------
function Stop_Agitator(){
  Call_Trigger_API(4,1);
  
}
//-----------------------------------------------------------------------------
function Start_Batch(){
  Call_Trigger_API(1,1);
}
 
//-----------------------------------------------------------------------------
function Stop_Batch(){
  Call_Trigger_API(2,1);
}

function Call_Trigger_API(index,value ){
  const apiUrl = 'http://127.0.0.1:8080/trigger/set?index='+ index + '&value=' + value;
  const data ={
    name:"Not Used"
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  fetch(apiUrl,requestOptions)
  .then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('API not found');
      } else if (response.status === 500) {
        throw new Error('Server error');
      } else {
        throw new Error('Network response was not ok');
      }
    }
    return response.json();
  })
  .then(data => {
    console.log('Start Agitator:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}