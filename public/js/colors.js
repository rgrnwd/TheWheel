module.exports = {
    generateColors: generateColors
};

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

