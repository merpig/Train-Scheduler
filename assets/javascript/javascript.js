// Initialize Firebase
var config = {
    apiKey: "AIzaSyDKBr8bApxFpdYmyj_CY_sFH7paTa8Su7c",
    authDomain: "trainscheduler-5c102.firebaseapp.com",
    databaseURL: "https://trainscheduler-5c102.firebaseio.com",
    projectId: "trainscheduler-5c102",
    storageBucket: "trainscheduler-5c102.appspot.com",
    messagingSenderId: "431516169102"
  };

firebase.initializeApp(config);

var database = firebase.database();

$(".btn").on("click", function(event) {
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var firstTrainDay = moment().format('YYYY-MM-DD') + "T";
    //console.log(firstTrainDay);
    var frequency = $("#frequency").val().trim();

    database.ref().push({
        name: trainName,
        place: destination,
        firstTime: firstTrainTime,
        firstDate: firstTrainDay,
        interval: frequency
    });
});

database.ref().on("child_added", function(childSnapshot){
    var tableBody = $("tbody");
    var tableRow = $("<tr>");

    var todayDate = moment().format('YYYY-MM-DDTHH:mm');
    var tempToday = moment(todayDate,'YYYY-MM-DDTHH:mm', true).format();
    var startDate = childSnapshot.val().firstDate + childSnapshot.val().firstTime;
    var tempStart = moment(startDate,'YYYY-MM-DDTHH:mm', true).format();

    var timeDifMinutes = moment(startDate).diff(moment(todayDate), 'minutes');
    //console.log(childSnapshot.val().name + " is this many minutes away: " + timeDifMinutes);

    while(timeDifMinutes < 0){

        timeDifMinutes += parseInt(childSnapshot.val().interval);
    }

    var nextArrival = moment().add(timeDifMinutes, 'minutes').format('LT');

    tableRow.append("<td>" + childSnapshot.val().name + "</td>");
    tableRow.append("<td>" + childSnapshot.val().place + "</td>");
    tableRow.append("<td>" + childSnapshot.val().interval + "</td>");
    
    //console.log(moment(childSnapshot.val().firstTime).fromNow())
    tableRow.append("<td>" + nextArrival + "</td>");
    tableRow.append("<td>" + timeDifMinutes + "</td>");
    tableBody.append(tableRow);
});