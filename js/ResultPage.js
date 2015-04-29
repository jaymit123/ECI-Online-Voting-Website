

$(document).ready(function () {

var updateButton = Ladda.create(document.querySelector('.UpdatePieChart')); //Update Button Spinner
  
var pieData,myPie;
$.post('Result',"", giveResultResponse);
 var ctx1 = document.getElementById("chart-area1").getContext("2d");


function giveResultResponse(data){
if(data.DATA === 'AVAILABLE'){
$('#aapseats').html(data.AAP);
$('#bjpseats').html(data.BJP);
$('#incseats').html(data.INC);
$('#totalseats').html(Number(data.AAP)+Number(data.BJP)+Number(data.INC));
pieData = [{
        value: Number(data.AAP),
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Aam Aadmi Party"
    }, {
        value: Number(data.BJP),
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Bhartiya Janta Party"
    }, {
        value: Number(data.INC),
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Indian National Congress"
    }];
myPie = new Chart(ctx1).Pie(pieData);

}else if(data.DATA === 'UNAVAILABLE'){
$('#canvas-holder,#aapseats,#bjpseats,#incseats,#totalseats').html("Data Unavailable!");

}

}

 
 $('#UpdatePieChart').on("click", function (e) {
myPie.destroy();
 e.preventDefault();
updateButton.start();
$.post('Result',"", giveResultResponse);
setTimeout(function(){updateButton.stop();},3000);
 $("#UpdatePieChart").addClass("disabled");
$('#updateButtonInfo').html("Last Updated on "+new Date());
setTimeout(function(){   
 $("#UpdatePieChart").removeClass("disabled");
},10000);;
 });
}); 