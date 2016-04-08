var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Q = require('q');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};


exports.serveAssets = function(res, asset, callback) {

  var encoding = {encoding: 'utf8'};
  var readFile = Q.denodeify(fs.readFile);

  readFile(archive.paths.siteAssets + asset, encoding)
    .then(function(contents) {
      contents && exports.sendResponse(res, contents);
    }, function(err) {
      return readFile(archive.paths.archivedSites + asset, encoding);
    })
    .then(function(contents) {
      contents && exports.sendResponse(res, contents);
    }, function(err) {
      callback ? callback() : exports.send404(res);
    });
  };


// SOLUTION LECTURE NOTES
// 3 possible solutions below
// - node callback
// - promises
// - advanced promises
exports.serveAssetsCB = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  var encoding = {encoding: 'utf8'};
  fs.readFile( archive.paths.siteAssets + asset, encoding, function(err, data){
    if(err){
      // file doesn't exist in public!
      fs.readFile( archive.paths.archivedSites + asset, encoding, function(err, data){
        if(err){
          // file doesn't exist in archive!
          callback ? callback() : exports.send404(res);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  })
};

exports.serveAssetsQ1 = function(res, asset, callback) {
  var encoding = {encoding: 'utf8'};
  var readFile = Q.denodeify(fs.readFile);

  readFile(archive.paths.siteAssets + asset, encoding)
    .then(function(contents) {
      contents && exports.sendResponse(res, contents);
    }, function(err) {
      return readFile(archive.paths.archivedSites + asset, encoding);
    })
    .then(function(contents) {
      contents && exports.sendResponse(res, contents);
    }, function(err) {
      callback ? callback() : exports.send404(res);
    });
};

exports.serveAssetsQ2 = function(res, asset, callback) {
  var encoding = {encoding: 'utf8'};
  var readFile = Q.denodeify(fs.readFile);

  var assetPaths = [
    archive.paths.siteAssets,
    archive.paths.archivedSites
  ];

  var sendAsset = function(paths){
    return readFile(paths.pop()+asset, encoding)
      .then(function(contents) {
        return exports.sendResponse(res, contents);
      })
      .catch(function(err) {
        return paths.length ? sendAsset(paths) :
              (callback ? callback() : exports.send404(res));
      });
  }

  return sendAsset(assetPaths);
};


exports.sendRedirect = function(response, location, status){
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};

exports.sendResponse = function(response, obj, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.end(obj);
};

exports.collectData = function(request, callback){
  var data = "";
  request.on("data", function(chunk){
    data += chunk;
  });
  request.on("end", function(){
    data = data.slice(4); // start of ugly hack so that this works for built in tests and normal use of app
    data = JSON.stringify(data);
    callback(data);
  });
};

exports.send404 = function(response){
  exports.sendResponse(response, '404: Page not found', 404);
}