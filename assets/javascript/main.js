const log = console.log;

// Clock for display purposes
var clock = moment().format('MMMM Do YYYY, HH:mm');
$(document).ready(function () {
    setInterval(function () {
        clock = moment().format('MMMM Do YYYY, HH:mm:ss');
        $('#clock').text(clock);
    }, 1000)
});

// Firebase intializer
var config = {
    apiKey: "AIzaSyAm85SM97-VmBvghuro7vbuOUaYepd5oSk",
    authDomain: "train-scheduler-f52f0.firebaseapp.com",
    databaseURL: "https://train-scheduler-f52f0.firebaseio.com",
    projectId: "train-scheduler-f52f0",
    storageBucket: "train-scheduler-f52f0.appspot.com",
    messagingSenderId: "60847523377"
};
firebase.initializeApp(config);

let database = firebase.database();
// when submitting new trains>>>
$('#form-submit').on('click', function (event) {
    event.preventDefault();
    let train = $('#train-name-input').val().trim();
    let destination = $('#destination-input').val().trim();
    let firstTrainInput = $('#first-train-input').val().trim();
    let firstTrain = moment(firstTrainInput, 'HH:mm').format("X");
    let frequency = $('#frequency-input').val().trim();
    let timeFormat = /[0-9]{2}\:[0-9]{2}/;
    if (train !== "" &&
        destination !== "" &&
        timeFormat.test(firstTrainInput) &&
        frequency > 0) {
        database.ref().push({
            name: train,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        });
        $('#train-adder')[0].reset();
    } else { alert("Please ensure your form is completed correctly") }

})


database.ref().on('child_added', function (snapshot) {
    let sv = snapshot.val();
    let name = sv.name;
    let destination = sv.destination;
    let frequency = sv.frequency;
    let firstTrain = moment(sv.firstTrain, "X").format("HH:mm");
    let nextArrival = firstTrain;
    let currentTime = moment().format('HH:mm');
    let timeToNextTrain = frequency;
    let arrivalTimes = [];
    while (moment(currentTime, "HH:mm").isAfter(moment(nextArrival, "HH:mm"))) {
        nextArrival = moment(nextArrival, "HH:mm").add(frequency, "m");
        arrivalTimes.push(nextArrival.format("HH:mm"));
    };
    timeToNextTrain = moment(nextArrival, "HH:mm").toNow("m");
    $('#train-schedule').append(
        `<tr>
                                <td scope="row">${name}</td>
                                <td>${destination}</td>
                                <td>${frequency}</td>
                                <td>${moment(nextArrival).format('HH:mm')}</td>
                                <td>${timeToNextTrain}</td>
                            </tr>`)

});

