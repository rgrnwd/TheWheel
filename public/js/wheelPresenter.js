var colors = require('./colors.js');
var physics = require('./physics.js');
var votes = require('./votes.js');

module.exports = {
    drawWheel: drawWheel,
    init: initWheel
};

var initialSize = 500;
var PhysicsCenter = {};

function initWheel(scaleFactor, cuisines, colors, startAngle) {
    var drawingCanvas = document.getElementById("canvas");

    if (drawingCanvas.getContext) {
        var context = drawingCanvas.getContext("2d");
        setCanvasSize(context, scaleFactor);
        setContextStyle(context, '22' * scaleFactor);
        drawWheel(context, cuisines, colors, startAngle)
    }
}

function setContextStyle(context, fontSize){
    context.strokeStyle = "black";
    context.textAlign = "right";
    context.lineWidth = 4;
    context.miterLimit = 1;
    context.font = fontSize + 'px arial';
}

function setCanvasSize(context, scaleFactor){
    var canvasWidth = initialSize * scaleFactor;
    var canvasHeight = initialSize * scaleFactor;

    var drawingCanvas = document.getElementById("canvas");
    drawingCanvas.width = canvasWidth;
    drawingCanvas.height = canvasHeight;

    PhysicsCenter = physics.calculateCenter(canvasHeight, canvasWidth);

    context.clearRect(0,0,initialSize,initialSize);
}

function drawWheel(context, cuisines, colors, startAngle) {
    var center = PhysicsCenter;

    var colorIndex = 0;
    var totalWeight = votes.getTotalVotes(cuisines);
    var accumulatedWeight = 0;

    var arc = physics.calculateArc(totalWeight); 
    var outsideRadius = (PhysicsCenter.x);// - 20;
    var textRadius = outsideRadius - 60;

    for(var i = 0; i < cuisines.length; i++) {
        var segmentColor = colors[i];
        var cuisineName = cuisines[i].name;

        var cuisineVotes = cuisines[i].votes;
        var arcSize = arc * cuisineVotes;
        var arcStart = startAngle + arc * accumulatedWeight;
        var arcEnd = arcStart + arcSize;
        
        if (cuisineVotes != 0) {
            drawWheelSegment(context, center, outsideRadius, arcStart, arcEnd, segmentColor);
            moveToTextStartPosition(context, center, arcStart, arcSize, textRadius);
    		drawHighlightedText(context, cuisineName, 35, 7, 'white', 'black');
            colorIndex++;
        }

		accumulatedWeight += cuisineVotes;
        context.restore();
    }
}

function drawWheelSegment(context, center, radius, arcStart, arcEnd, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(center.x, center.y, radius, arcStart, arcEnd, false);
    context.arc(center.x, center.y, 0, arcEnd, arcStart, true);
    context.fill();
    context.save();
}

function moveToTextStartPosition(context, center, arcStart, arcSize, radius){
    var theta = arcStart + arcSize / 2;
    var startPoint = physics.calculateStartPoint(center, radius, theta);
	context.translate(startPoint.x, startPoint.y);
	context.rotate(theta);
}

function drawHighlightedText(context, text, x, y, insideColor, outsideColor) {
    context.strokeStyle = outsideColor;
    context.strokeText(text, x, y);
    drawText(context, insideColor, text, x, y);
}

function drawText(context, color, text, x, y) {
    context.fillStyle = color;
    context.fillText(text, x, y);
}