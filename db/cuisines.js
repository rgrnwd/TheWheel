var moment = require('moment');

var lastFriday = moment().startOf('week').subtract(2, 'days');
var fridayBeforeLast = moment().startOf('week').subtract(2 + 7, 'days');
var fridayBeforeLastLast = moment().startOf('week').subtract(2 + 14, 'days');

exports.cuisines = [
    {"name": "American", "emotion": "dude!", "lastSelected":"", "votes" : 1},
    {"name": "Japanese", "emotion": "kampai!!", "lastSelected":"", "votes" : 1},
    {"name": "Chinese", "emotion": "hao chi!", "lastSelected":"", "votes" : 1},
    {"name": "Healthy", "emotion": "oh boy!", "lastSelected":"", "votes" : 1},
    {"name": "Italian", "emotion": "(plz no pizza)", "lastSelected":fridayBeforeLastLast.toDate(), "votes" : 1},
    {"name": "Indian", "emotion": "Wah!!", "lastSelected":lastFriday.toDate(), "votes" : 1},
    {"name": "Mediterranean", "emotion": "yalla!", "lastSelected":"", "votes" : 1},
    {"name": "French", "emotion": "voila!", "lastSelected":fridayBeforeLast.toDate(), "votes" : 1},
    {"name": "Latin", "emotion": "fiesta!!", "lastSelected":"", "votes" : 1},
    {"name": "Korean", "emotion": "Ah sssaa!", "lastSelected":"", "votes" : 1},
    {"name": "Surprise!", "emotion": "WOAH!", "lastSelected":"", "votes" : 1},
    {"name": "Vietnamese", "emotion": "Yay!", "lastSelected":"", "votes" : 1},
    {"name": "Thai", "emotion": ":D!", "lastSelected":"", "votes" : 1}
];