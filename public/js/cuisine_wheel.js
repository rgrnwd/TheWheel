var colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
    "#2E2C75", "#673A7E", "#CC0071", "#F80120",
    "#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];

var cuisines = ["American", "Japanese", "Chinese", "Mediterranean",
    "Italian", "Indian", "Persian", "Mexican",
    "Moroccan", "Oriental", "French", "Greek"];

var startAngle = 0;
var arc = Math.PI / (colors.length * 0.5);
var spinTimeout = null;

var spinAngleStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

window.onload = function() {
    var spinButton = document.getElementById("spin");
    spinButton.addEventListener('click', spin);
    drawRouletteWheel();
};

function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var canvasWidth = 600;
        var canvasHeight = 600;
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;

        var outsideRadius = (canvasWidth/2) - 20;
        var insideRadius = 0;
        var textRadius = outsideRadius - 60;
        ctx = canvas.getContext("2d");

        ctx.clearRect(0,0,canvasWidth,canvasWidth);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.font = 'bold 16px Helvetica, Arial';

        for(var i = 0; i < colors.length; i++) {
            var angle = startAngle + i * arc;
            ctx.fillStyle = colors[i];

            ctx.beginPath();
            ctx.arc(centreX, centreY, outsideRadius, angle, angle + arc, false);
            ctx.arc(centreX, centreY, insideRadius, angle + arc, angle, true);
            ctx.fill();
            ctx.save();

            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur    = 0;
            ctx.shadowColor   = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            ctx.translate(centreX + Math.cos(angle + arc / 2) * textRadius,
                centreY + Math.sin(angle + arc / 2) * textRadius); // text start point
            ctx.rotate(angle + arc / 2 + Math.PI / 2); //text rotation
            var text = cuisines[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(centreX - 16, centreY - (outsideRadius + 20));
        ctx.lineTo(centreX + 16, centreY - (outsideRadius + 20));
        ctx.lineTo(centreX + 16, centreY - (outsideRadius - 20));
        ctx.lineTo(centreX + 36, centreY - (outsideRadius - 20));
        ctx.lineTo(centreX + 0, centreY - (outsideRadius - 52));
        ctx.lineTo(centreX - 36, centreY - (outsideRadius - 20));
        ctx.lineTo(centreX - 16, centreY - (outsideRadius - 20));
        ctx.lineTo(centreX - 16, centreY - (outsideRadius + 20));
        ctx.fill();
    }
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = 3000;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if(spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    var text = cuisines[index];
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
}