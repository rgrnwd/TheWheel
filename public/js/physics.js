
module.exports = {
	distanceBetweenPoints : distanceBetweenPoints,
	calculateSpeed : calculateSpeed,
	calculateSpinTime : calculateSpinTime,
	randomStartAngle : randomStartAngle,
	calculateSpinAngle : calculateSpinAngle,
	calculateTextStartPoint : calculateTextStartPoint, 
	calculateRotation : calculateRotation, 
	getSelectedCuisineIndex : getSelectedCuisineIndex, 
	calculateArc : calculateArc,
    getTotalVotes : getTotalVotes
}
function distanceBetweenPoints(start, end) {
    var a = end.x - start.x;
    var b = end.y - start.y;
    return Math.sqrt( a*a + b*b );
}

function calculateSpeed(distance, timeTaken){
	var speed = distance / timeTaken;

    speed = 10 / (speed*speed);

    if (speed > 100) {
        speed = 100 * (Math.random() + 0.5);
    }

    return speed;
}
function calculateArc(length){
	return Math.PI / (length * 0.5);
}
function calculateSpinTime(speed, distance){

    var spinTimeTotal = Math.ceil(distance * 20);

    if ((spinTimeTotal / 100) < speed) {
        spinTimeTotal += speed * (Math.random() + 1.5) * 100;
    }

    return spinTimeTotal;
}
function calculateSpinAngle(spinTime, options){
    var spinAngle = options.spinAngleStart - easeOut(spinTime, options.spinAngleStart, options.spinTimeTotal);

	return (spinAngle * Math.PI / 180);
}
function randomStartAngle(){
	return Math.random() * 10 + 10;
}
function calculateRotation(angle, arc){
	return angle + arc / 2;
}
function calculateTextStartPoint(angle, arc, textRadius, physicsCenter){

    var angleArc = calculateRotation(angle, arc);
    var cos = Math.cos(angleArc);
    var sin = Math.sin(angleArc);
    var startPointX = physicsCenter.X + cos * textRadius;
    var startPointY = physicsCenter.Y + sin * textRadius;

    return { x:startPointX, y: startPointY };
}

function getSelectedCuisineIndex(cuisines, startAngle) {
    var totalVotes = getTotalVotes(cuisines);
    var arc = getCurrentArc(totalVotes, startAngle);
    return getIndexBasedOnArc(cuisines, arc);
}

function getIndexBasedOnArc(cuisines, arc) {
    var accumulatedArcs = 0;

    for (var i = 0; i < cuisines.length; i++) {
        if (cuisines[i].votes != 0) {
            var upper = accumulatedArcs + cuisines[i].votes;
            var lower = accumulatedArcs;

            if (lower <= arc && arc < upper) {
                return i;
            } else {
                accumulatedArcs += cuisines[i].votes;
            } 
        }
    }
}

function getCurrentArc(totalVotes, startAngle) {
    var arc = (Math.PI * 2) / totalVotes;
    var degrees = (startAngle * 180 / Math.PI + 90) % 360;
    var arcd = arc * 180 / Math.PI;
    return Math.floor((360 - degrees) / arcd);
}
function getTotalVotes(cuisines) {
    var totalVotes = 0;

    for(var i = 0; i < cuisines.length; i++) {
        totalVotes += cuisines[i].votes;
    }

    return totalVotes;
}
function easeOut(t, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return c*(tc + -3*ts + 3*t);
}