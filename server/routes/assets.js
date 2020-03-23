const { loadFiles, removeFile } = require('../controllers/ftp')

function getStorageAssets (req, res) {
  const kind = req.storage.kind
  const identifier = req.query.identifier

  if (kind === 'ftp') {
    return loadFiles(req.storage, identifier)
      .then(list => res.json(list).end())
      .catch((err) => res.status(500).jsonp(err).end())
  } else {
    return res.end()
  }
}

function removeStorageAsset (req, res) {
  const kind = req.storage.kind
  const identifier = req.query.identifier

  if (kind === 'ftp') {
    return removeFile(req.storage, identifier)
      .then(() => res.end())
      .catch((err) => res.status(500).jsonp(err).end())
  } else {
    return res.end()
  }
}

module.exports = { getStorageAssets, removeStorageAsset }
