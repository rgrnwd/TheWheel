module.exports = {
    hideSpeechBubble: hideSpeechBubble,
    showSelectedCuisine: showSelectedCuisine
};

function hideSpeechBubble() {
    var result = document.getElementById("lunch-result");
    result.innerText = " ";
    result.className = "speech-bubble hidden";
}

function showSelectedCuisine(cuisine) {
    var result = document.getElementById("lunch-result");
    result.innerText = cuisine.name + ', ' + cuisine.emotion;
    result.className = "speech-bubble";
}

