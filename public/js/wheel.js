var physics = require('./physics.js');
var votes = require('./votes.js');

module.exports = {
    init: initWheel
};

var spinTimeout = null, wheelSpinning = false, startAngleRadians = 0;
var dragStarted = false, dragStartTime = 0, dragEndTime = 0;
var PhysicsCenter = {};

var mousePositions = [];

function initWheel(cuisines, scaleFactor, colors) {
    var drawingCanvas = document.getElementById("canvas");
    if (drawingCanvas.getContext) {
        var context = drawingCanvas.getContext("2d");
        setCanvasSize(context, scaleFactor);
        setContextStyle(context, '22' * scaleFactor);
        drawWheel(context, cuisines, colors);
        addMouseDragDrop(context, cuisines, colors, scaleFactor);
    }
}

function setContextStyle(context, fontSize){
    context.strokeStyle = "black";
    context.textAlign = "right";
    context.lineWidth = 2;
    context.miterLimit = 1;
    context.font = fontSize + 'px arial';
}

function drawHighlightedText(context, text, x, y) {
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.strokeText(text, x, y);
    context.fillStyle = 'white';
    context.fillText(text, x, y);
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
    drawWheel(context, cuisines, colors);
    var opts = {
        spinAngleStart: options.spinAngleStart,
        speed: options.speed,
        spinTimeTotal: options.spinTimeTotal,
        spinTime: spinTime
    };

    spinTimeout = setTimeout(function() {rotateWheel(context, cuisines, colors, scaleFactor, opts)}, options.speed);
}

function drawWheel(context, cuisines, colors) {
    var colorIndex = 0;
    var totalWeight = votes.getTotalVotes(cuisines);
    var accumulatedWeight = 0;

    var arc = physics.calculateArc(totalWeight); 
    var outsideRadius = (PhysicsCenter.X) - 20;
    var textRadius = outsideRadius - 60;

    for(var i = 0; i < cuisines.length; i++) {
        var weighting = cuisines[i].votes;
        var radian = startAngleRadians + arc * accumulatedWeight;
        accumulatedWeight += weighting;

        if (weighting != 0) {
            drawWheelSegment(context, colors[colorIndex], radian, arc * weighting, outsideRadius);
            drawText(context, cuisines[i].name, radian, arc * weighting, textRadius);
            colorIndex++;
        }

        context.restore();
    }
}

function drawText(context, text, radian, arc, radius){
    var startPoint = physics.calculateTextStartPoint(radian, arc, radius, PhysicsCenter);

    context.translate(startPoint.x, startPoint.y);
    context.rotate(physics.calculateRotation(radian, arc));
    drawHighlightedText(context, text, 35, 7);
}

function drawWheelSegment(context, color, radian, arc, outsideRadius) {

    context.fillStyle = color;
    context.beginPath();
    context.arc(PhysicsCenter.X, PhysicsCenter.Y, outsideRadius, radian, radian + arc, false);
    context.arc(PhysicsCenter.X, PhysicsCenter.Y, 0, radian + arc, radian, true);
    context.fill();
    context.save();
}

function setCanvasSize(context, scaleFactor){
    var canvasWidth = 500 * scaleFactor;
    var canvasHeight = 500 * scaleFactor;

    PhysicsCenter.X = canvasWidth * 0.5;
    PhysicsCenter.Y = canvasHeight * 0.5;

    context.clearRect(0,0,canvasWidth,canvasHeight);
}

function stopRotateWheel(cuisines) {
    clearTimeout(spinTimeout);
    var totalVotes = votes.getTotalVotes(cuisines);
    var selectedIndex = physics.getSelectedCuisineIndex(cuisines, totalVotes, startAngleRadians);
    var drawingCanvas = document.getElementById("canvas");
    drawingCanvas.dispatchEvent(new CustomEvent('wheelStopped', {'detail': cuisines[selectedIndex]}));

    wheelSpinning = false;
}
