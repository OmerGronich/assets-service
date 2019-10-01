function routes (app) {
  const authCheck = require('../middleware/auth-check')
  const editorCheck = require('../middleware/editor-check')
  const { getStorageById, createStorage, getStorageList, removeStorage, updateStorage } = require('./storage')

  app.use(authCheck, editorCheck)

  function empty (_, res) {
    return res.status(200).jsonp({ message: 'endpoint not yet exists' }).end()
  }

  app
    .get('/api/assets', getStorageList)
    .post('/api/assets', createStorage)
    .put('/api/assets/:storageId', getStorageById, updateStorage)
    .delete('/api/assets/:storageId', getStorageById, removeStorage)
    .get('/api/assets/:storageId', getStorageById, empty)
    .post('/api/assets/:storageId', getStorageById, empty)
    .put('/api/assets/:storageId/:assetId', getStorageById, empty)
    .delete('/api/assets/:storageId/:assetId', getStorageById, empty)
}

module.exports = routes
