var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  test: path.join(__dirname, '..test/testdata/sites')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.sendRequest = function(response, loc, status){
  status = status || 302;
  response.writeHead(status, {Loc:loc});
  response.end();

}

exports.readListOfUrls = function(callback) {
  var accumulator = '';
  var two;
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    console.log(Array.isArray(data) + '         ANSWER')
    for(var key in data){
      //console.log(data[key])
      accumulator+=data[key];
    }
    // console.log(typeof)
    if (err) { throw 'err'; }
    two = accumulator.split('\n')
    console.log(two, "   CONFIM!")
    callback(two);
    console.log('is the accumulator a string?       ' + typeof accumulator);
  });

};

// return resultant boolean of find url within array provided by readListOfUrls
exports.isUrlInList = function(url, callback) {
  var checker = 0;
  // console.log(this.readListOfUrls(function(arguments))
  var here = this.readListOfUrls(function(args){
    console.log(args + '   <------ ')
    for(var i = 0; i < args.length; i++){
      if(args[i] == url) {
        callback(true);
        checker = 1;
      }
     }
    if(checker === 0) { callback(false) }
  });
    return !!checker ? true : false
};

//mkdirSync || maybe mkdir (asynch version)
// if url not in list (i.e. isUrlInList fails)...
  // fs.appendFile url to exports.path.list
exports.addUrlToList = function(url, callback) {
      fs.appendFile(exports.paths.list, url, 'utf-8', (err) => {
        if (err) { console.log('ERROR! +  ' + err); }
        console.log('Just added ' + url + ' to    ' + exports.paths.list+ '!');
        callback(url);
      });
};

//see if url file path exists with fs.existsSync
exports.isUrlArchived = function(url, callback) {
  if (fs.existsSync(exports.paths.archivedSites + '/' + url)) {
    console.log(fs.existsSync(exports.paths.archivedSites + '/' + url));
    callback(true);
  } else {
    callback(false);
  }
};


exports.downloadUrls = function(urls) {
  console.log(urls, '    <---- URL'); // ['www.example.com', 'www.google.com']
  //loop through urls
  _.each(urls, function(url) {
    /* request.get({"url": url}, path, callback) */
    request.get('http://' + url).pipe(fs.createWriteStream(exports.paths.test + '/' + url));
  });

  // console.log(fs.readdirSync(archive.paths.archivedSites)); //['www.example.com', 'www.google.com']
};
