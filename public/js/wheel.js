var physics = require('./physics.js');
var votes = require('./votes.js');
var canvas = require('./canvas.js');

module.exports = {
    init: initWheel
};

var spinTimeout = null, wheelSpinning = false, startAngleRadians = 0;
var dragStarted = false, dragStartTime = 0, dragEndTime = 0;

var mousePositions = [];

function initWheel(cuisines, scaleFactor, colors) {
    var drawingCanvas = document.getElementById("canvas");
    if (drawingCanvas.getContext) {
        var context = drawingCanvas.getContext("2d");
        canvas.init(context, scaleFactor, cuisines, colors, startAngleRadians);
        addMouseDragDrop(context, cuisines, colors, scaleFactor);
    }
}

function addMouseDragDrop(context, cuisines, colors, scaleFactor){
    var endMouseDragHandler = function(e) {checkEndDrag(e, context, cuisines, colors, scaleFactor)};
    var drawingCanvas = document.getElementById("canvas");
    drawingCanvas.addEventListener('mousedown', checkStartDrag);
    drawingCanvas.addEventListener('mousemove', mouseMove);
    drawingCanvas.addEventListener('mouseup', endMouseDragHandler);
    drawingCanvas.addEventListener('mouseout', endMouseDragHandler);
}

function mouseMove(e) {
    if(dragStarted) {
        mousePositions.push({x: e.pageX, y: e.pageY});
    }
}

function checkStartDrag(e) {
    if (!wheelSpinning) {
        var drawingCanvas = document.getElementById("canvas");
        drawingCanvas.dispatchEvent(new Event('wheelStarted'));
        var mouseStart = {
            x: e.pageX,
            y: e.pageY
        };
        mousePositions = [mouseStart];
        dragStarted = true;
        dragStartTime = e.timeStamp;
    }
}

function distanceTravelled() {
    var distance = 0;
    mousePositions.forEach(function(mousePosition, index) {
        if(index > 0) {
            distance += physics.distanceBetweenPoints(mousePositions[index-1],mousePosition);
        }
    });
    return distance;
}

function checkEndDrag(e, context, cuisines, colors, scaleFactor) {
    if (dragStarted && !wheelSpinning) {
        dragStarted = false;
        dragEndTime = e.timeStamp;
        rotateWheel(context, cuisines, colors, scaleFactor, getSpinOptions(dragEndTime));
    }
}

function getSpinOptions(dragEndTime){

    var distance = distanceTravelled();
    var speed = physics.calculateSpinTimeout(distance, dragEndTime - dragStartTime);
    
    var spinTimeTotal = 2000;
    var spinAngleStart = physics.randomStartAngle();

    var spinOptions = {
        spinAngleStart: spinAngleStart,
        speed: speed,
        spinTimeTotal: spinTimeTotal,
        spinTime: 0
    };

    return spinOptions;
}
function rotateWheel(context, cuisines, colors, scaleFactor, options) {
    var spinTime = options.spinTime + options.speed;
    if(spinTime >= options.spinTimeTotal) {
        stopRotateWheel(cuisines);
        return;
    }
    wheelSpinning = true;
    startAngleRadians += physics.calculateSpinAngleInRadians(spinTime, options.spinAngleStart, options.spinTimeTotal);
    canvas.drawWheel(context, cuisines, colors, startAngleRadians);
    var opts = {
        spinAngleStart: options.spinAngleStart,
        speed: options.speed,
        spinTimeTotal: options.spinTimeTotal,
        spinTime: spinTime
    };

    spinTimeout = setTimeout(function() {rotateWheel(context, cuisines, colors, scaleFactor, opts)}, options.speed);
}

function stopRotateWheel(cuisines) {
    clearTimeout(spinTimeout);
    var totalVotes = votes.getTotalVotes(cuisines);
    var selectedIndex = physics.getSelectedCuisineIndex(cuisines, totalVotes, startAngleRadians);
    var drawingCanvas = document.getElementById("canvas");
    drawingCanvas.dispatchEvent(new CustomEvent('wheelStopped', {'detail': cuisines[selectedIndex]}));
    wheelSpinning = false;
}
