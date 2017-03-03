// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var CronJob = require('cron').CronJob;

new CronJob('******', () => {
  archive.downloadUrls(archive.readListOfUrls());
}, false);

CronJob.start();
