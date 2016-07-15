var service = require('./service.js');
var wheel = require('./wheel.js');
var colors = require('./colors.js');
var speechBubble = require('./speech_bubble.js');

var scaleFactor = 1;
var cuisineList;
var colorsList;

window.onload = function() {
    scaleFactor = calculateScaleFactor();
    loadCuisines(scaleFactor);
};

window.addEventListener("resize", function(){
    handleResize();
});

function handleResize(){
    
    var newScaleFactor = calculateScaleFactor();
    if (scaleFactor != newScaleFactor){
        scaleFactor = newScaleFactor;
        wheel.init(cuisineList, scaleFactor, colorsList);
    }    
}

function calculateScaleFactor(){
    var scale = 1;

    var w = window.innerWidth-2; // -2 accounts for the border
    var h = window.innerHeight-2;

    if (h < 300 || w < 320){
        scale = 0.5;
    }
    else if (h < 500 || w < 400){
        scale = 0.65;
    }
    else if (h < 600 || w < 600){
        scale = 0.8;
    }
    
    return scale;
}

function loadCuisines() {
    service.getCuisines().then(function(cuisines) {
        cuisineList = cuisines;
        removeLastWeeksChoice();
        getColorsByCuisines(cuisines);
        addCanvasEvents();
        wheel.init(cuisines, scaleFactor, colorsList);
    }).catch(function(error) {
        console.log(error);
    });
}

function removeLastWeeksChoice(){
    
}
function getColorsByCuisines(cuisines){
    var numberOfColorsNeeded = countCuisinesWithPositiveVoteCount(cuisines);
    colorsList = colors.generateColors(numberOfColorsNeeded);
}

function addCanvasEvents(){
    var drawingCanvas = document.getElementById("canvas");
    drawingCanvas.addEventListener('wheelStopped', handleWheelStopped, false);
    drawingCanvas.addEventListener('wheelStarted', handleWheelStarted, false);
}

function countCuisinesWithPositiveVoteCount(cuisines) {
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
    showCheer(true);
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

