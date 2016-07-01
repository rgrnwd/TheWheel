
module.exports = {
	distanceBetweenPoints : distanceBetweenPoints,
    calculateSpinTimeout : calculateSpinTimeout,
	randomStartAngle : randomStartAngle,
	calculateSpinAngle : calculateSpinAngleInRadians,
	calculateTextStartPoint : calculateTextStartPoint, 
	calculateRotation : calculateRotation, 
	getSelectedCuisineIndex : getSelectedCuisineIndex, 
    getCuisineFromSelectedArc : getCuisineFromSelectedArc,
	calculateArc : calculateArc,
    getArcByAngle : getArcByAngle 
};

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
    var spinAngle = spinAngleStart - (spinAngleStart * easeOut(spinTime, spinTimeTotal));

	return (spinAngle * Math.PI / 180); //degrees to radians
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
    var arcIndex = Math.floor((360 - degrees) / arcSizeDegrees);
    return arcIndex;
}

function easeOut(t, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return (tc + -3*ts + 3*t);
}