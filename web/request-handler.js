var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
var http = require('http-get');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  statusCode = 200;
    // console.log('this is the req method:', req.method)

// http.get('./public/index.html', function (err, res) {
//   if (err) {
//     console.error(err);
//     return;
//   }
  
//   console.log(res.code, res.headers);
// });

   //an option 
   if(req.method === 'GET') {
      // console.log('req url: ', req.url)
      if(req.url === '/'){
        res.writeHead(statusCode, {'Content-type': 'text/hmtl'});
        fs.readFile('./public/index.html', function (err, html){
          console.log('html and err:', html, err)
        }); 
        res.end('<input>')
      } else  {
        console.log('else')
      }
   }


};
