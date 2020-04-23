function routes (app) {
  const authCheck = require('../middleware/auth-check')
  const editorCheck = require('../middleware/editor-check')
  const upload = require('multer')()
  const { getStorageById, createStorage, getStorageList, removeStorage, updateStorage, getStorage } = require('./storage')
  const { getStorageAssets, removeStorageAsset, verifyIdentifier, uploadStorageAssets } = require('./assets')

  app.use(authCheck, editorCheck)

  function empty (_, res) {
    return res.status(200).jsonp({ message: 'endpoint not yet exists' }).end()
  }

  app
    .get('/api/assets/:storageId', getStorageById, getStorageAssets)
    .post('/api/assets/:storageId', getStorageById, verifyIdentifier, upload.any(), uploadStorageAssets)
    .put('/api/assets/:storageId', getStorageById, empty) // update metadata, not the actual asset buffer
    .delete('/api/assets/:storageId', getStorageById, verifyIdentifier, removeStorageAsset)

  app
    .get('/api/storage', getStorageList)
    .post('/api/storage', createStorage)
    .get('/api/storage/:storageId', getStorageById, getStorage)
    .put('/api/storage/:storageId', getStorageById, updateStorage)
    .delete('/api/storage/:storageId', getStorageById, removeStorage)

}

module.exports = routes
