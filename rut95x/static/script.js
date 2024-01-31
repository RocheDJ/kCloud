setInterval(function () {
    $.ajax({
        type: "GET",
        url: "/",
    })
        .done(function (data) {
            console.log(data);
            var tableHtml = '';
            for (row in data) {
                tableHtml += '<tr>';
                for (d in row) {
                    tableHtml += '<td>' + d + '</td>';
                }
                tableHtml += '</tr>';
            }
            $("#dataTable").html(tableHtml)
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        });
}, 1000 * 60); 


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

