const ftpService = require('../services/ftp')
const gcsService = require('../services/gcs')

function getService({ kind }) {
  if (kind === 'gcs') {
    return gcsService
  } else if (kind === 'ftp') {
    return ftpService
  }
}

function getStorageAssets(req, res) {
  const identifier = req.query.identifier
  const service = getService(req.storage)

  if (!service) {
    return res.end()
  }
  service.loadFiles(req.storage, identifier)
    .then(list => res.json(list).end())
    .catch(() => {
      res.status(500).json({ message: 'could not get assets' }).end()
    })
}

function uploadStorageAssets(req, res) {
  const file = req.files[0].buffer
  const { identifier, extension, prefix } = req.query || {}
  const service = getService(req.storage)

  if (!service) {
    return res.end()
  }

  service.uploadFile(req.storage, { identifier, file, extension, prefix })
    .then((result) => res.status(200).json(result).end())
    .catch((error) => {
      res.status(500).json({ message: error.message || 'could not upload asset' }).end()
    })
}

function removeStorageAsset(req, res) {
  const identifier = req.query.identifier
  const service = getService(req.storage)

  if (!service) {
    return res.end()
  }
  service.removeFile(req.storage, identifier, req.body.file)
    .then(() => res.end())
    .catch(() => res.status(500).json({ message: 'could not remove asset' }).end())
}

function verifyIdentifier(req, res, next) {
  if (!req.query.identifier) {
    return res
      .status(500)
      .json({ message: 'Must supply asset identifier' })
      .end()
  }
  next()
}

module.exports = { getStorageAssets, removeStorageAsset, verifyIdentifier, uploadStorageAssets }
