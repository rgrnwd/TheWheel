
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
    getArcStoppedWithin : getArcStoppedWithin
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
function getArcStoppedWithin(totalArcs, startAngle) {
    var arc = (Math.PI * 2) / totalArcs;
    var degrees = (startAngle * 180 / Math.PI + 90) % 360;
    var arcd = arc * 180 / Math.PI;
    return Math.floor((360 - degrees) / arcd);
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

function getSelectedCuisineIndex(cuisinesLength, startAngle) {
    //Math.PI radians = 180 degrees
    var arc = (Math.PI * 2) / cuisinesLength;
    var degrees = (startAngle * 180 / Math.PI + 90) % 360;
    var arcd = arc * 180 / Math.PI;
    return Math.floor((360 - degrees) / arcd);
}

function easeOut(t, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return c*(tc + -3*ts + 3*t);
}