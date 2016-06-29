var url = require('url') ;

function getBaseUrl() {
    var appUrl = url.parse(document.location.href);
    return appUrl.protocol + "//" + appUrl.host;
}

module.exports = {
    getBaseUrl: getBaseUrl
};