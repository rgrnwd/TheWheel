module.exports = {
    generateColors: generateColors,
    rgbToHtml: rgb2html,
    componentToHex: componentToHex
};

function componentToHex(c, minLength) {
    var hex = c.toString(16);

    var stringHex = "";

    if (hex.length < minLength) {
        var padding = minLength - hex.length;

        for (var i = 0; i < padding; i++) {
            stringHex += "0";
        }

    }

    stringHex += hex;

    return stringHex;
}

function rgb2html(r, g, b) {
    var htmlColor =  "#" + componentToHex(r, 2) + componentToHex(g, 2) + componentToHex(b, 2);
    if (htmlColor.match(/^#[0-9a-f]{6}$/)) {
        return htmlColor;
    }

    return "#ffffff";
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

