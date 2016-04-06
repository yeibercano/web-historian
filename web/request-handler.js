var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
var http = require('http-get');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  statusCode = 200;
    // console.log('this is the req method:', req.method)
   
   //an option 
   if(req.method === 'GET') {
        res.writeHead(statusCode, {'Content-type': 'text/hmtl'});
      // console.log('req url: ', req.url)
      if(req.url === '/'){
        fs.readFile('web/public/index.html', 'UTF-8', function (err, html){
          if(err){
            console.log('error in get /:', err);
          }
          res.writeHead(200, {"Content-type": "text/html"});
          res.end(html)
        }); 
      } else  {
        res.writeHead(404, {"Content-type": "text/html"});
        res.end("404 file not found");
      }
   }


};
