const tmp = require('tmp');

module.exports = function (options = {fileFieldName: 'file'}) {
  return function saveFileToServer(req, res, next) {
    if (!req.files) return res.status(400).send({status: 'error', details: 'No files were uploaded.'});

    const uploadedFile = req.files[options.fileFieldName];
    const tempFileName = tmp.tmpNameSync({mode: 0o644, postfix: '.csv'});

    uploadedFile.mv(tempFileName, (err) => {
      if (err) {
        res.status(500).send({status: 'error', details: JSON.stringify(err.message)});
      }
    });

    req.feathers.fromMiddleware = {filename: tempFileName};

    next();
  };
};
