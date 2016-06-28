#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('wheel:server');
var http = require('http');
var config = require('../config/config');
var mongoose = require('mongoose');
var cuisines = require('../db/cuisines');
/**
 * Get port from environment and store in Express.
 */

/** 
* Connect to Mongodb
*/
mongoose.connect(config.db);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var CuisineSchema = mongoose.Schema({
    id: Number,
    name: String, 
    emotion: String, 
    lastSelected: Date}, 
  {collection: 'Cuisines'});
var cuisineModel = mongoose.model('cuisine', CuisineSchema);
cuisineModel.find(function(err, cuisines) {
  if(cuisines && cuisines.length > 0) {
    
    // =========== ============ ============ ============
    // Un-comment this section to refresh cuisine list!
    // =========== ============ ============ ============

    cuisineModel.remove({}, function(err) { 
       console.log('collection removed') 
       populateCuisines();
    });
  }
  else {
    populateCuisines();
  }
});

var populateCuisines = function() {
  cuisines.cuisines.forEach(function(cuisine) {
    new cuisineModel(cuisine).save(function(err, savedCuisine) {
      if(err) console.error(err);
    });
  });
};

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
