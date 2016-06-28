//https://dzone.com/articles/creating-roulette-wheel-using

var http = require('http');

var cuisines = [];
var colors = [];

var emotions = {
    'Latin': 'fiesta!!',
    'Japanese': 'kampai!!',
    'Surprise!': 'WOAH!!',
    'Korean': 'Ah sssaa!',
    'Indian': 'yummy!',
    'Italian': '(plz no pizza)',
    'Healthy': 'yay salad!',
    'American': 'dude!!',
    'French': 'merde!!'
};

var startAngle = 0, spinAngleStart, spinTimeout = null, 
    spinTime = 0, speed, spinTimeTotal, wheelSpinning = false;
var dragStarted = false, dragStartTime = 0, dragEndTime = 0;

var context;
var arc;
var mousePositions = [];

module.exports = {
    init: init,
    getCuisines: getCuisines,
    generateColors: generateColors
};

function init() {
    getCuisines(initWheel);
}

function initWheel(err, result) {
    if (err){
        console.log(err);
        return;
    }

    arc = Math.PI / (cuisines.length * 0.5);
    generateColors(cuisines.length);
    drawRouletteWheel();
    addMouseDragDrop();
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function RGB2HTML(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function generateColors(numberOfColors)
{
    colors = [];

    centerOfSinWave = 127;
    deviationFromCenter = 128;
    frequency = Math.PI*2/numberOfColors;

    for (var i = 0; i < numberOfColors; ++i)
    {
        red   = Math.sin(frequency*i + 0 * (Math.PI / 180)) * deviationFromCenter + centerOfSinWave;
        green = Math.sin(frequency*i + 100 * (Math.PI / 180)) * deviationFromCenter + centerOfSinWave;
        blue  = Math.sin(frequency*i + 200 * (Math.PI / 180)) * deviationFromCenter + centerOfSinWave;

        colors.push(RGB2HTML(parseInt(red), parseInt(green), parseInt(blue)));
    }

    return colors;
}

function getColor(index) {
    return colors[index];
}

function getCuisines(callback) {
    http.get('/cuisines', function(response) {
        cuisines = []; // clear the existing list of cuisines

        if (response.statusCode == 200){
            var responseStr = '';
            response.on('data', function(data) {
                responseStr += data;
            });
            response.on('end', function() {
                var res = JSON.parse(responseStr);

                if (res && Array.isArray(res)){
                    res.forEach(function(cuisine) {
                        cuisines.push(cuisine.name);
                    });
                }
                callback(null, cuisines);
            });
        }else{
            callback('Getting cuisines responded with error code: '
                + response.statusCode 
                + ': '
                + response.statusMessage);
        }
    });
}

function drawRouletteWheel() {
    var drawingCanvas = document.getElementById("canvas");
    var canvasWidth = 600;
    var canvasHeight = 600;

    if (drawingCanvas.getContext) {
        var physicsCenterX = canvasWidth * 0.5;
        var physicsCenterY = canvasHeight * 0.5;
        var outsideRadius = (physicsCenterX) - 20;
        var insideRadius = 0;
        var textRadius = outsideRadius - 60;
        context = drawingCanvas.getContext("2d");

        context.clearRect(0,0,canvasWidth,canvasWidth);

        context.strokeStyle = "black";
        context.textAlign = "right";
        context.lineWidth = 2;
        context.miterLimit = 1;

        context.font = '22px arial';

        for(var i = 0; i < cuisines.length; i++) {
            var angle = startAngle + i * arc;
            context.fillStyle = getColor(i);

            context.beginPath();
            context.arc(physicsCenterX, physicsCenterY, outsideRadius, angle, angle + arc, false);
            context.arc(physicsCenterX, physicsCenterY, insideRadius, angle + arc, angle, true);
            context.fill();
            context.save();

            context.fillStyle = "black";
            context.translate(physicsCenterX + Math.cos(angle + arc / 2) * textRadius,
                physicsCenterY + Math.sin(angle + arc / 2) * textRadius); // text start point
            context.rotate(angle + arc / 2); //text rotation
            drawHighlightedText(cuisines[i], 35, 7);
            context.restore();
        }
    }
}

function drawHighlightedText(text, x, y) {
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.strokeText(text, x, y);
    context.fillStyle = 'white';
    context.fillText(text, x, y);
}

function addMouseDragDrop(){
    var drawingCanvas = document.getElementById("canvas");
    drawingCanvas.addEventListener('mousedown', checkStartDrag);
    drawingCanvas.addEventListener('mousemove', mouseMove);
    drawingCanvas.addEventListener('mouseup', checkEndDrag);
    drawingCanvas.addEventListener('mouseout', checkEndDrag);
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

function checkEndDrag(e) {
    if (dragStarted && !wheelSpinning) {
        dragEndTime = e.timeStamp;
        var distance = distanceTravelled();
        var timeTaken = dragEndTime - dragStartTime;
        speed = distance / timeTaken;
        dragStarted = false;
        speed = 10 / (speed*speed);

        if (speed > 100) {
            speed = 100 * (Math.random() + 0.5);
        }

        spinTimeTotal = Math.ceil(distance * 20);

        if ((spinTimeTotal / 100) < speed) {
            spinTimeTotal += speed * (Math.random() + 1.5) * 100;
        }

        spin();
    }
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    rotateWheel();
}

function rotateWheel() {
    spinTime += speed;

    if(spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    wheelSpinning = true;
    var spinAngle = spinAngleStart - easeOut(spinTime, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, speed);
    var result = document.getElementById("lunch-result");
    result.innerText = "Friday Yummy!";
    result.className = "speech-bubble hidden";
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);

    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    context.save();
    var text = cuisines[index];
    var result = document.getElementById("lunch-result");
    result.innerText = text + ', ' + getEmotion(text);
    result.className = "speech-bubble";
    showCheer(false);
    wheelSpinning = false;
}

function showCheer(show){
    if (show){
        document.getElementById("cheer-right").className = "cheerleader right";
        document.getElementById("cheer-left").className = "cheerleader left";
    }else{
        document.getElementById("cheer-right").className = "cheerleader right hidden ";
        document.getElementById("cheer-left").className = "cheerleader left hidden";
    }

}
function getEmotion(cuisine){
    return emotions[cuisine] || 'woohoo!';
}

function easeOut(t, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return c*(tc + -3*ts + 3*t);
}