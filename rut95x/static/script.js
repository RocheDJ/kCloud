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
          let jJSON = sJSON.replaceAll("'",'"')
          let oJSON = JSON.parse(jJSON);
          let sRowValueID = "value_" + sID
          document.getElementById(sRowValueID).innerHTML = oJSON[0].value;
          let sRowTitleID = "title_" + sID
          document.getElementById(sRowTitleID).innerHTML = oJSON[0].title;
          }
      catch (error) {
          console.log(error)
        } 
      }
    }
}