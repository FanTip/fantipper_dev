const fs = require('fs');

const log_save = function (val) {
  let today = new Date();
  let date = today.getFullYear() + '-' +
    (today.getMonth() + 1) + '-' +
    today.getDate() + '--' +
    (today.getHours() > 12 ? (today.getHours() - 12) : today.getHours()) + ':' +
    today.getMinutes() + ':' + today.getSeconds() + ':' +
    today.getMilliseconds();
  let data = {
    time: date,
    error: val
  }

  fs.appendFile('.access.log', (JSON.stringify(data) + '\n'), function (err) {
    if (err) {
      log_save(err);
    }
  });
}


module.exports = {
  log_save
}