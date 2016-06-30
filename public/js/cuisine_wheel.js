var service = require('./cuisine_service.js');

var spinTimeout = null, wheelSpinning = false;
var dragStarted = false, dragStartTime = 0, dragEndTime = 0;

var context, drawingCanvas;
var arc;
var mousePositions = [];
var scaleFactor = 1;

var PhysicsCenter = {
    X: 0,
    Y: 0
}
module.exports = {
    init: init,
    generateColors: generateColors
};

function init() {
    service.getCuisines().then(function(cuisines) {
        initWheel(cuisines);
    }).catch(function(error) {
        console.log(error);
    });
}

function initWheel(cuisines) {
    var colors = generateColors(cuisines.length);
    drawingCanvas = document.getElementById("canvas");
    if (drawingCanvas.getContext) {
        context = drawingCanvas.getContext("2d");
        setContextStyle('22' * scaleFactor);
    }
    drawRouletteWheel(0, cuisines, colors, scaleFactor);
    addMouseDragDrop(cuisines, colors);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb2html(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function generateColors(numberOfColors)
{
    var colors = [];

    centerOfSinWave = 128;
    deviationFromCenter = 127;
    frequency = Math.PI*2/numberOfColors;

    for (var i = 0; i < numberOfColors; ++i)
    {
        red   = Math.sin(frequency*i + 0 * (Math.PI / 180)) * deviationFromCenter + centerOfSinWave;
        green = Math.sin(frequency*i + 100 * (Math.PI / 180)) * deviationFromCenter + centerOfSinWave;
        blue  = Math.sin(frequency*i + 200 * (Math.PI / 180)) * deviationFromCenter + centerOfSinWave;

        colors.push(rgb2html(parseInt(red), parseInt(green), parseInt(blue)));
    }

    return colors;
}

function drawRouletteWheel(startAngle, cuisines, colors, scaleFactor) {

    setCanvasSize(scaleFactor);

    var arc = Math.PI / (cuisines.length * 0.5);
    var outsideRadius = (PhysicsCenter.X) - 20;
    var textRadius = outsideRadius - 60;

    for(var i = 0; i < cuisines.length; i++) {
        var angle = startAngle + i * arc;
        context.fillStyle = colors[i];

        context.beginPath();
        context.arc(PhysicsCenter.X, PhysicsCenter.Y, outsideRadius, angle, angle + arc, false);
        context.arc(PhysicsCenter.X, PhysicsCenter.Y, 0, angle + arc, angle, true);
        context.fill();
        context.save();
        drawText(cuisines[i].name, angle, arc, textRadius);
        context.restore();
    }
}

function setCanvasSize(scaleFactor){

    var canvasWidth = 500 * scaleFactor;
    var canvasHeight = 500 * scaleFactor;

    PhysicsCenter.X =canvasWidth * 0.5;
    PhysicsCenter.Y = canvasHeight * 0.5;

    context.clearRect(0,0,canvasWidth,canvasHeight);
}

function drawText(text, angle, arc, textRadius){

    var angleArc = angle + arc / 2;
    var cos = Math.cos(angleArc);
    var sin = Math.sin(angleArc);
    var startPointX = PhysicsCenter.X + cos * textRadius;
    var startPointY = PhysicsCenter.Y + sin * textRadius;
    context.translate(startPointX, startPointY); 
    context.rotate(angleArc); 
    drawHighlightedText(text, 35, 7);
}

function setContextStyle(fontSize){

    context.strokeStyle = "black";
    context.textAlign = "right";
    context.lineWidth = 2;
    context.miterLimit = 1;
    context.font = fontSize + 'px arial';
}

function drawHighlightedText(text, x, y) {
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.strokeText(text, x, y);
    context.fillStyle = 'white';
    context.fillText(text, x, y);
}

function addMouseDragDrop(cuisines, colors){
    var endMouseDragHandler = function(e) {checkEndDrag(e, cuisines, colors)};
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
        showCheer(true);
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

function checkEndDrag(e, cuisines, colors) {
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
            spinTime: 0,
            startAngle: 0
        };
        hideSpeechBubble();
        rotateWheel(cuisines, colors, options);
    }
}

function rotateWheel(cuisines, colors, options) {
    var spinTime = options.spinTime + options.speed;
    var startAngle = options.startAngle;

    if(spinTime >= options.spinTimeTotal) {
        stopRotateWheel(startAngle, cuisines);
        return;
    }
    wheelSpinning = true;
    var spinAngle = options.spinAngleStart - easeOut(spinTime, options.spinAngleStart, options.spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel(startAngle, cuisines, colors, scaleFactor);
    var opts = {
        spinAngleStart: options.spinAngleStart,
        speed: options.speed,
        spinTimeTotal: options.spinTimeTotal,
        spinTime: spinTime,
        startAngle: startAngle
    };
    spinTimeout = setTimeout(function() {rotateWheel(cuisines, colors, opts)}, options.speed);
}

function hideSpeechBubble() {
    var result = document.getElementById("lunch-result");
    result.innerText = "Friday Yummy!";
    result.className = "speech-bubble hidden";
}

function stopRotateWheel(startAngle, cuisines) {
    clearTimeout(spinTimeout);
    var selectedIndex = getSelectedCuisineIndex(startAngle, cuisines);
    showSelectedCuisine(cuisines[selectedIndex]);
    saveCuisine(cuisines[selectedIndex]);
    showCheer(false);
    wheelSpinning = false;
}

function getSelectedCuisineIndex(startAngle, cuisines) {
    //Math.PI radians = 180 degrees
    var arc = (Math.PI * 2) / cuisines.length;
    var degrees = (startAngle * 180 / Math.PI + 90) % 360;
    console.log(startAngle,degrees);
    var arcd = arc * 180 / Math.PI;
    return Math.floor((360 - degrees) / arcd);
}

function saveCuisine(cuisine) {
    service.saveCuisineForTheWeek(cuisine).then(function() {
        console.log(cuisine.name, "saved as this week's choice");
    }).catch(function(error) {
        console.log(error);
    });
}

function showSelectedCuisine(cuisine) {
    var result = document.getElementById("lunch-result");
    result.innerText = cuisine.name + ', ' + cuisine.emotion;
    result.className = "speech-bubble";
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

function easeOut(t, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return c*(tc + -3*ts + 3*t);
}