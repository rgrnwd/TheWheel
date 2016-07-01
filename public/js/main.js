var service = require('./service.js');
var wheel = require('./wheel.js');
var colors = require('./colors.js');
var speechBubble = require('./speech_bubble.js');

var scaleFactor = 1;

window.onload = function() {
    loadCuisines();
};

function loadCuisines() {
    service.getCuisines().then(function(cuisines) {
        var drawingCanvas = document.getElementById("canvas");
        drawingCanvas.addEventListener('wheelStopped', handleWheelStopped, false);
        drawingCanvas.addEventListener('wheelStarted', handleWheelStarted, false);
        var colorsRequired = getCuisinesWithPositiveVoteCount(cuisines);
        wheel.init(cuisines, scaleFactor, colors.generateColors(colorsRequired));
    }).catch(function(error) {
        console.log(error);
    });
}

function getCuisinesWithPositiveVoteCount(cuisines) {
    var colorsRequired = 0;

    for (var i = 0; i < cuisines.length; i++) {
        if (cuisines[i].votes > 0) {
            colorsRequired++;
        }
    }

    return colorsRequired;
}

function handleWheelStopped(e) {
    speechBubble.showSelectedCuisine(e.detail);
    saveCuisine(e.detail);
    showCheer(false);
}

function handleWheelStarted() {
    speechBubble.hideSpeechBubble();
    showCheer(false);
}

function saveCuisine(cuisine) {
    service.saveCuisineForTheWeek(cuisine).then(function() {
        console.log(cuisine.name, "saved as this week's choice");
    }).catch(function(error) {
        console.log(error);
    });
}

function showCheer(show){
    if (show){
        document.getElementById("cheer-right").className = "cheerleader right";
        document.getElementById("cheer-left").className = "cheerleader left";
        document.getElementById("cheer-bottom").className = "cheerleader bottom";
    }else{
        document.getElementById("cheer-right").className = "cheerleader right hidden ";
        document.getElementById("cheer-left").className = "cheerleader left hidden";
        document.getElementById("cheer-bottom").className = "cheerleader bottom hidden";
    }
}

