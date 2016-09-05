var service = require('./service.js');

window.onLoad = function () {
  service.getCuisines().then(function(cuisines) {
      cuisineList = cuisines;
      console.log(cuisineList);
  }).catch(function(error) {
        console.log(error);
  });
}
