// Move the code that draws the wheel into this file...
module.exports = {
    init: initWheel
};

var spinTimeout = null, wheelSpinning = false, startAngle = 0;
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

function distanceBetweenPoints(start, end) {
    var a = end.x - start.x;
    var b = end.y - start.y;
    return Math.sqrt( a*a + b*b );
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
            distance += distanceBetweenPoints(mousePositions[index-1],mousePosition);
        }
    });
    return distance;
}

function checkEndDrag(e, context, cuisines, colors, scaleFactor) {
    if (dragStarted && !wheelSpinning) {
        dragEndTime = e.timeStamp;
        var distance = distanceTravelled();
        var timeTaken = dragEndTime - dragStartTime;
        var speed = distance / timeTaken;
        dragStarted = false;
        speed = 10 / (speed*speed);

        if (speed > 100) {
            speed = 100 * (Math.random() + 0.5);
        }

        var spinTimeTotal = Math.ceil(distance * 20);

        if ((spinTimeTotal / 100) < speed) {
            spinTimeTotal += speed * (Math.random() + 1.5) * 100;
        }
        var spinAngleStart = Math.random() * 10 + 10;

        var options = {
            spinAngleStart: spinAngleStart,
            speed: speed,
            spinTimeTotal: spinTimeTotal,
            spinTime: 0
        };
        rotateWheel(context, cuisines, colors, scaleFactor, options);
    }
}

function rotateWheel(context, cuisines, colors, scaleFactor, options) {
    var spinTime = options.spinTime + options.speed;

    if(spinTime >= options.spinTimeTotal) {
        stopRotateWheel(cuisines);
        return;
    }
    wheelSpinning = true;
    var spinAngle = options.spinAngleStart - easeOut(spinTime, options.spinAngleStart, options.spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
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
    var totalWeight = 0;
    var accumulatedWeight = 0;

    for(var i = 0; i < cuisines.length; i++) {
        totalWeight += cuisines[i].votes;
    }

    var arc = Math.PI / (totalWeight * 0.5);
    var outsideRadius = (PhysicsCenter.X) - 20;
    var textRadius = outsideRadius - 60;

    for(var i = 0; i < cuisines.length; i++) {
        var weighting = cuisines[i].votes;
        var angle = startAngle + arc * accumulatedWeight;
        totalWeight += weighting;

        if (weighting > 0) {
            console.log(weighting + " " + cuisines[i].name);
            drawSegment(context, colors[i], angle, arc * weighting, outsideRadius);
            drawText(context, cuisines[i].name, angle, arc * weighting, textRadius);
        }

        context.restore();
    }
}

function drawSegment(context, color, angle, arc, outsideRadius) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(PhysicsCenter.X, PhysicsCenter.Y, outsideRadius, angle, angle + arc, false);
    context.arc(PhysicsCenter.X, PhysicsCenter.Y, 0, angle + arc, angle, true);
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

function drawText(context, text, angle, arc, textRadius){
    var angleArc = angle + arc / 2;
    var cos = Math.cos(angleArc);
    var sin = Math.sin(angleArc);
    var startPointX = PhysicsCenter.X + cos * textRadius;
    var startPointY = PhysicsCenter.Y + sin * textRadius;
    context.translate(startPointX, startPointY);
    context.rotate(angleArc);
    drawHighlightedText(context, text, 35, 7);
}

function stopRotateWheel(cuisines) {
    clearTimeout(spinTimeout);
    var selectedIndex = getSelectedCuisineIndex(cuisines);
    var drawingCanvas = document.getElementById("canvas");
    drawingCanvas.dispatchEvent(new CustomEvent('wheelStopped', {'detail': cuisines[selectedIndex]}));

    wheelSpinning = false;
}

function getSelectedCuisineIndex(cuisines) {
    //Math.PI radians = 180 degrees
    var totalVotes = 0;
    var votesCounted = 0;

    for(var i = 0; i < cuisines.length; i++) {
        totalVotes += cuisines[i].votes;
    }

    var arc = (Math.PI * 2) / totalVotes;
    var degrees = (startAngle * 180 / Math.PI + 90) % 360;
    var arcd = arc * 180 / Math.PI;
    var result = Math.floor((360 - degrees) / arcd);
    for (var i = 0; i < cuisines.length; i++) {
        if ((votesCounted  + cuisines[i].votes) < result) {
            votesCounted += cuisines[i].votes;
        } else {
            return i;
        }
    }
    return cuisines.length - 1;
}

function easeOut(t, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return c*(tc + -3*ts + 3*t);
}
