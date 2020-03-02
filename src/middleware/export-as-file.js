const tmp = require('tmp');
const fs = require('fs');

module.exports = function () {
  return function exportAsFile(req, res) {
    const result = res.data;

    if (result.error) res.send(result);

    const dataString = JSON.stringify(res.data, null, 2);
    // Make the filename
    const dateAndTimeArr = new Date().toISOString().split('T');
    const timeArr = dateAndTimeArr[1].split(':');
    const nameTemplate = `COE_export_${dateAndTimeArr[0]}_${timeArr[0] + timeArr[1]}_XXXXXX.json`;

    // Make a temporary file (removed on process complete)
    const tmpFileObj = tmp.fileSync({mode: 0o644, template: nameTemplate});

    fs.writeFileSync(tmpFileObj.fd, dataString, { mode: 0o644});

    // TODO: Why does dev server restart after this?
    res.download(tmpFileObj.name, function (err) {
      tmpFileObj.removeCallback();
      if (err) res.end(err);
    });
  };
};
