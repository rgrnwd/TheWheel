var http = require('http');

module.exports = {
    getCuisines: getCuisines
};

function getCuisines(callback) {
    http.get('/cuisines', function(response) {
        cuisines = []; // clear the existing list of cuisines

        if (response.statusCode == 200){
            var responseStr = '';
            response.on('data', function(data) {
                responseStr += data;
            });
            response.on('end', function() {
                var res = JSON.parse(responseStr);

                if (res && Array.isArray(res)){
                    res.forEach(function(cuisine) {
                        cuisines.push(cuisine);
                    });
                }
                callback(null, cuisines);
            });
        }else{
            callback('Getting cuisines responded with error code: '
                + response.statusCode
                + ': '
                + response.statusMessage);
        }
    });
}

