const Storage = require('mongoose').model('StorageList.vue')
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
      return res.status(200).jsonp({ name: storage.name, kind: storage.kind }).end()
    })
    .catch(() => res.status(400).jsonp({ message: 'storage creation failed' }).end())
}

function getStorageList (req, res) {
  Storage.find({})
    .select('kind name')
    .lean()
    .then(list => {
      if (!list) {
        return Promise.reject(null)
      }
      return res.status(200).jsonp(list).end()
    })
    .catch(() => res.status(400).jsonp({ message: 'error loading storage list' }).end())
}

module.exports = { createStorage, getStorageList }
