const log = console.log;


var clock = moment().format('MMMM Do YYYY, HH:mm');
// Clock for display purposes
$(document).ready(function () {
    setInterval(function () {
        clock = moment().format('MMMM Do YYYY, HH:mm:ss');
        $('#clock').text(clock);
    }, 1000)
});


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



$('#form-submit').on('click', function (event) {

    event.preventDefault();

    let train = $('#train-name-input').val().trim();
    let destination = $('#destination-input').val().trim();
    let firstTrain = moment($('#first-train-input').val().trim(), 'HH:mm').format("X");
    let frequnecy = $('#frequency-input').val().trim();

    database.ref().push({ name: train, destination: destination, firstTrain: firstTrain, frequency: frequnecy });

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
