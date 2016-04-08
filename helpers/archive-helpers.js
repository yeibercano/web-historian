var fs = require('fs');
var path = require('path');
var request = require('request');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};


exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function(err, sites) {
    sites = sites.toString().split('\n');
    if( callback ){
      callback(sites);
    }
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site, i) {
      return site.match(url);
    });
    callback(found);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url + '\n', function(err, file){
    callback();
  });
};

exports.isUrlArchived = function(url, callback){
    url = url.slice(1); // ugly hack
    url = url.slice(0, url.length-1); // ugly hack 
  var sitePath = path.join(exports.paths.archivedSites, url);

  fs.exists(sitePath, function(exists) {
    callback(exists);
  
  });
};

exports.downloadUrls = function(urls){
  // Iterate over urls and pipe to new files

  if(typeof urls === 'string'){ //hack
    var temp = urls; //hack
    urls = []; //hack
    urls.push(temp); //hack
  }
  _.each(urls, function (url) {
    url = url.slice(1); // ugly hack
    url = url.slice(0, url.length-1); // ugly hack   
    
    if (!url) { return; }
    
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + "/" + url));
  });
};