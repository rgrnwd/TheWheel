//https://dzone.com/articles/creating-roulette-wheel-using

var http = require('http');

var colors = ["#B8D430", "#3AB745", "#029990", "#4202FA",
    "#4340A8", "#81499E", "#CC0071", "#F80120",
    "#F35B20", "#FB9A00", "#FFCC00", "#FEF200", "#E4F52C"];

var cuisines = [];

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

var startAngle = 0;
var arc;
var spinTimeout = null;

var spinAngleStart;
var spinTime = 0;
var speed = 30;
var spinTimeTotal = 10000;

var ctx;
var canvasWidth = 600;
var canvasHeight = 600;
var wheelSpinning = false;
var mouseStart;
var mouseEnd;
var dragStarted = false;
var mousePositions = [];
var dragStartTime = 0;
var dragEndTime = 0;

module.exports = {
    init: init
};

function init() {
    getCuisines(initWheel);
}

function initWheel() {
    arc = Math.PI / (cuisines.length * 0.5);
    drawRouletteWheel();
    addMouseDragDrop();
}

function getCuisines(callback) {
    http.get('/cuisines', function(response) {
        var responseStr = '';
        response.on('data', function(data) {
            responseStr += data;
        });
        response.on('end', function() {
            var res = JSON.parse(responseStr);
            res.forEach(function(cuisine) {
                cuisines.push(cuisine.name);
            });
            callback();
        });
    });
}

function drawRouletteWheel() {
    var drawingCanvas = document.getElementById("canvas");

    if (drawingCanvas.getContext) {
        var physicsCenterX = canvasWidth * 0.5;
        var physicsCenterY = canvasHeight * 0.5;
        var outsideRadius = (physicsCenterX) - 20;
        var insideRadius = 0;
        var textRadius = outsideRadius - 60;
        ctx = drawingCanvas.getContext("2d");

        ctx.clearRect(0,0,canvasWidth,canvasWidth);

        ctx.strokeStyle = "black";
        ctx.textAlign = "right";
        ctx.lineWidth = 2;
        ctx.miterLimit = 1;

        ctx.font = '22px arial';

        for(var i = 0; i < cuisines.length; i++) {
            var angle = startAngle + i * arc;
            ctx.fillStyle = colors[i];

            ctx.beginPath();
            ctx.arc(physicsCenterX, physicsCenterY, outsideRadius, angle, angle + arc, false);
            ctx.arc(physicsCenterX, physicsCenterY, insideRadius, angle + arc, angle, true);
            ctx.fill();
            ctx.save();

            ctx.fillStyle = "black";
            ctx.translate(physicsCenterX + Math.cos(angle + arc / 2) * textRadius,
                physicsCenterY + Math.sin(angle + arc / 2) * textRadius); // text start point
            ctx.rotate(angle + arc / 2); //text rotation
            drawHighlightedText(cuisines[i], 35, 7);
            ctx.restore();
        }
    }
}

function drawHighlightedText(text, x, y) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
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
        mouseStart = {
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
        mouseEnd = {
            x: e.pageX,
            y: e.pageY
        };
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
    ctx.save();
    var text = cuisines[index];
    var result = document.getElementById("lunch-result");
    result.innerText = text + ', ' + getEmotion(text);
    result.className = "speech-bubble";
    showCheer(false);
    wheelSpinning = false;

}

function showCheer(show){

    if (show){
        document.getElementById("cheer-right").className = "cheerleader right ";
        document.getElementById("cheer-left").className = "cheerleader left ";
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