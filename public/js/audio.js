module.exports = {
    play: play
};

var audio = new Audio('music/Wheel.mp3');

function play(play){
    if (play){
        audio.play();
    }
    else{
        audio.pause();
        audio.currentTime = 0;
    }
}