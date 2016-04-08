var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var http = require('http-get');
var fs = require('fs');
var url = require('url');
var _ = require('underscore');
// require more modules/folders here!

var getSite = function(request, response){
  var urlPath = url.parse(request.url).pathname;

  // / means index.html
  if (urlPath === '/') { urlPath = '/index.html'; }

  helpers.serveAssets(response, urlPath, function() {
    // trim leading slash if present
    if (urlPath[0] === '/') { urlPath = urlPath.slice(1)}

    archive.isUrlInList(urlPath, function(found){
      if (found) {
        helpers.sendRedirect(response, '/loading.html');
      } else {
        helpers.send404(response);
      }
    });
  });
};

var saveSite = function(request, response){
  helpers.collectData(request, function(data) {
    if (typeof data === 'string'){ // start of ugly hack so that this works for built in tests and normal use of app
      var urlTEMP = data;
      data = {};
      data.url = urlTEMP;
      data = JSON.stringify(data);
    } // end of ugly hack so that this works for built in tests and normal use of app

    
    var url = JSON.parse(data).url.replace('http://', '');
    // check sites.txt for web site
    archive.isUrlInList(url, function(found){
      
      if (found) { // found site
        // check if site is on disk
        archive.isUrlArchived(url, function(exists) {
           if (exists) {
            // console.log('RESPONSE', response)
            url = url.slice(1); // ugly hack
            url = url.slice(0, url.length-1); // ugly 
            // redirect to site page (/www.google.com)
            helpers.sendRedirect(response, '/' + url);
          } else {
            // Redirect to loading.html
            helpers.sendRedirect(response, '/loading.html');
          }
        });
      } else { // not found
        // add to sites.txt
        archive.addUrlToList(url, function(){ // PROBLEM IS THIS ONLY REDIRECTS AND DOESN"T DOWNLOAD THE FILE
          archive.downloadUrls(url); // hack
          // Redirect to loading.html
          helpers.sendRedirect(response, '/loading.html');
        });
      }
    });
  });
};

exports.handleRequest = function (req, res) {
  var handler = actions[req.method];
  
  if (handler) {
    handler(req, res);
  } else {
    helpers.send404(res);
  }
};


var actions = {
  'GET': getSite,
  'POST': saveSite
}; 
