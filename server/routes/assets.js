const { loadFiles, removeFile, uploadFile } = require('../controllers/ftp')

function getStorageAssets (req, res) {
  const kind = req.storage.kind
  const identifier = req.query.identifier

  if (kind === 'ftp') {
    return loadFiles(req.storage, identifier)
      .then(list => res.json(list).end())
      .catch(() => res.status(500).json({ message: 'could not get assets' }).end())
  } else {
    return res.end()
  }
}

function uploadStorageAssets (req, res) {
  const kind = req.storage.kind
  const identifier = req.query.identifier
  const file = req.files[0].buffer

  if (kind === 'ftp') {
    return uploadFile(req.storage, identifier, file)
      .then((result) => res.status(200).json(result).end())
      .catch(() => {
        res.status(500).json({ message: 'cloud not upload asset'}).end()
      })
  } else {
    return res.end()
  }
}

function removeStorageAsset (req, res) {
  const kind = req.storage.kind
  const identifier = req.query.identifier

  if (kind === 'ftp') {
    return removeFile(req.storage, identifier, req.body.file)
      .then(() => res.end())
      .catch(() => res.status(500).json({message: 'could not remove asset'}).end())
  } else {
    return res.end()
  }
}

function verifyIdentifier (req, res, next) {
  if (!req.query.identifier) {
    return res
      .status(500)
      .json({ message: 'Must supply asset identifier' })
      .end()
  }
  next()
}

module.exports = { getStorageAssets, removeStorageAsset, verifyIdentifier, uploadStorageAssets }
