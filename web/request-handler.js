var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  console.log('server request type   ' + request.method + '   for url' + request.url);

  if (request.method === 'GET') {
    if (request.url === '/') {
      fs.readFile(archive.paths.siteAssets+'/index.html', 'utf-8', function(er, dat) {
        response.writeHead(200, http.headers);
        response.end(dat);
      });
    } else {
      fs.readFile(archive.paths.archivedSites + '/' + request.url, 'utf-8', function(err, data){
        if(err) {
          response.writeHead(404, http.headers);
          response.end(data);
        }
        else if (!err) {
          response.writeHead(200, http.headers);
          response.end(data);
        }
      });
    }
  }

   if (request.method === 'POST') {
    let acc = '';

    request.on('data', function(chunk) { //'data' event is how we collect data
      acc += chunk;
      console.log("acc:   " + acc);
    });

    request.on('end', function() {
      let urlPacket = acc.slice(4)+'\n';
      archive.isUrlArchived(urlPacket, function(archived) {
        if (!archived) {
          fs.appendFile(archive.paths.siteAssets+ '/' + 'loading.html')
        }
      })
      fs.appendFile(archive.paths.list, urlPacket, 'utf-8', (err) => {
        if (err) { console.log('ERROR! +  ' + err); }
        console.log('Just added some data to    ' + archive.paths.list + '!');

        response.writeHead(302, http.headers);
        response.end();
      });
    });
   }
 };


