const { rename } = require('fs')
const uniqid = require('uniqid')
const { loadFiles, removeFile, uploadFile } = require('../services/ftp')
const { tempFolder } = require('../../config')

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
  const oldPath = req.files[0].path
  const { identifier, prefix, extension } = req.query || {}
  const filePath = `${tempFolder}/${prefix}-${uniqid()}.${extension}`

  rename(oldPath, filePath, () => {
    if (kind === 'ftp') {
      return uploadFile(req.storage, { identifier, file: filePath })
        .then((result) => res.status(200).json(result).end())
        .catch((error) => {
          res.status(500).json({ message: error.message || 'could not upload asset' }).end()
        })
    } else {
      return res.end()
    }
  })
}

function removeStorageAsset (req, res) {
  const kind = req.storage.kind
  const identifier = req.query.identifier

  if (kind === 'ftp') {
    return removeFile(req.storage, identifier, req.body.file)
      .then(() => res.end())
      .catch(() => res.status(500).json({ message: 'could not remove asset' }).end())
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
