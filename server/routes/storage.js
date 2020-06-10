const Storage = require('mongoose').model('Storage')
const uniqid = require('uniqid')
const { setSecret } = require('../../helpers/secrets-management')

function createStorage (req, res) {
  const body = req.body || {}
  const storage = new Storage({
    tenant: req.headers.tenant,
    name: body.name,
    kind: body.kind,
    metadata: body.metadata,
    authentication: uniqid()
  })

  return setSecret(storage.tenant, storage.authentication, body.authentication)
    .then(() => storage.save())
    .then((storage) => {
      return res.status(200).json({
        _id: storage._id,
        name: storage.name,
        kind: storage.kind,
        metadata: storage.metadata
      }).end()
    })
    .catch(() => res.status(400).jsonp({ message: 'storage creation failed' }).end())
}

function getStorageList (req, res) {
  return Storage.find({ tenant: req.headers.tenant })
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
    .then(() => res.status(200).json({}).end())
    .catch(() => res.status(400).json({ message: 'failed to remove storage' }).end())
}

function updateStorage (req, res) {
  const body = req.body || {}
  let promise = Promise.resolve()
  if (body.name && body.name !== req.storage.name) {
    req.storage.name = body.name
  }
  if ((body.kind && body.kind !== req.storage.kind) || body.authentication) {
    req.storage.kind = body.kind || req.storage.kind
    promise = setSecret(req.storage.tenant, req.storage.authentication, body.authentication)
  }
  if (body.metadata) {
    req.storage.metadata = body.metadata
  }
  promise
    .then(() => req.storage.save())
    .then(() => res.status(200).json({
      name: req.storage.name,
      kind: req.storage.kind,
      metadata: req.storage.metadata
    }).end())
    .catch(() => res.status(400).json({ message: 'failed to update storage' }).end())
}

function getStorageById (req, res, next) {
  return Storage.findOne({ _id: req.params.storageId, tenant: req.headers.tenant })
    .then(storage => {
      req.storage = storage
      next()
    })
    .catch(() => res.status(404).json({ message: 'could not find storage' }).end())
}

function getStorage (req, res) {
  const { _id, name, kind, metadata } = req.storage
  res.status(200).json({ _id, name, kind, metadata }).end()
}

module.exports = { createStorage, getStorageList, removeStorage, getStorageById, updateStorage, getStorage }
