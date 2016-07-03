
module.exports = {
    radiansToDegrees : radiansToDegrees,
    degreesToRadians : degreesToRadians,
	distanceBetweenPoints : distanceBetweenPoints,
    calculateSpinTimeout : calculateSpinTimeout,
	randomStartAngle : randomStartAngle,
    calculateSpinAngleInRadians : calculateSpinAngleInRadians,
	calculateStartPoint : calculateStartPoint, 
	calculateRotation : calculateRotation, 
	getSelectedCuisineIndex : getSelectedCuisineIndex, 
    getCuisineFromSelectedArc : getCuisineFromSelectedArc,
	calculateArc : calculateArc,
    getArcByAngle : getArcByAngle,
    easeOut : easeOut
};

function degreesToRadians(degrees) {
    var radians = degrees * Math.PI / 180;
    return radians;
}

function radiansToDegrees(radians) {
    var degrees = radians * 180 / Math.PI;
    return degrees;
}

function distanceBetweenPoints(start, end) {
    var a = end.x - start.x;
    var b = end.y - start.y;
    return Math.sqrt( a*a + b*b );
}

function calculateSpinTimeout(distance, timeTaken){
    if (timeTaken == 0 || distance == 0) {
        return 5;
    }
    var timeOut = timeTaken / distance;
    return timeOut > 5 ? 5 : timeOut;
}

function calculateArc(length){
	return Math.PI / (length * 0.5);
}
function calculateSpinAngleInRadians(spinTime, spinAngleStart, spinTimeTotal){
    var spinAngle_DEG = spinAngleStart - (spinAngleStart * this.easeOut(spinTime, spinTimeTotal));
	return degreesToRadians(spinAngle_DEG);
}
function randomStartAngle(){
    return Math.random() * 20 + 5;
}
function calculateRotation(angle, arc){
	return angle + arc / 2;
}
function calculateStartPoint(center, radius, theta){
    //Math.cos & Math.sin use radians
    var xPoint = center.x + radius * Math.cos(theta);
    var yPoint = center.y + radius * Math.sin(theta);

    return { x : xPoint, y : yPoint };
}

function getSelectedCuisineIndex(cuisines, totalArcs, startRadiant) {
    var arc = getArcByAngle(totalArcs, startRadiant, Math.PI / 2);
    return getCuisineFromSelectedArc(cuisines, arc);
}

function getCuisineFromSelectedArc(cuisines, arc) {
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
    
    return cuisines.length - 1;
}

function getArcByAngle(totalArcs, startRadiant, offsetRadian) {
    var singleArcSize = (Math.PI * 2) / totalArcs;
    var degrees = ((startRadiant + offsetRadian) * 180 / Math.PI) % 360;
    var arcSizeDegrees = singleArcSize * 180 / Math.PI;
    return Math.floor((360 - degrees) / arcSizeDegrees);
}

function easeOut(t, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return (tc + -3*ts + 3*t);
}