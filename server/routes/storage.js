const Storage = require('mongoose').model('Storage')
const uniqid = require('uniqid')
const { setSecret } = require('../../helpers/secrets-management')

function createStorage (req, res) {
  const body = req.body || {}
  const storage = new Storage({
    name: body.name,
    kind: body.kind,
    authentication: uniqid()
  })

  return setSecret(storage.authentication, body.authentication)
    .then(() => storage.save())
    .then(storage => {
      if (!storage) {
        return Promise.reject(null)
      }
      return res.status(200).jsonp({
        name: req.storage.name,
        kind: req.storage.kind,
        metadata: req.storage.metadata
      }).end()
    })
    .catch(() => res.status(400).jsonp({ message: 'storage creation failed' }).end())
}

function getStorageList (req, res) {
  return Storage.find({})
    .select('kind name metadata')
    .lean()
    .then(list => {
      if (!list) {
        return Promise.reject(null)
      }
      return res.status(200).jsonp(list).end()
    })
    .catch(() => res.status(400).jsonp({ message: 'error loading storage list' }).end())
}

function removeStorage (req, res) {
  req.storage.remove()
    .then(() => res.status(200).jsonp({}).end())
    .catch(() => res.status(400).jsonp({ message: 'failed to remove storage' }).end())
}

function updateStorage (req, res) {
  const body = req.body || {}
  let promise = Promise.resolve()
  if (body.name && body.name !== req.storage.name) {
    req.storage.name = body.name
  }
  if ((body.kind && body.kind !== req.storage.kind) || body.authentication) {
    req.storage.kind = body.kind || req.storage.kind
    promise = setSecret(req.storage.authentication, body.authentication)
  }
  if (body.metadata) {
    req.storage.metadata = body.metadata
  }
  promise
    .then(() => req.storage.update())
    .then(() => res.status(200).jsonp({
      name: req.storage.name,
      kind: req.storage.kind,
      metadata: req.storage.metadata
    }).end())
    .catch(() => res.status(400).jsonp({ message: 'failed to remove storage' }).end())
}

function getStorageById (req, res, next) {
  return Storage.findById(req.params.storageId)
    .then(storage => {
      req.storage = storage
      next()
    })
    .catch(() => res.status(404).jsonp({ message: 'could not find storage' }).end())
}

module.exports = { createStorage, getStorageList, removeStorage, getStorageById, updateStorage }
