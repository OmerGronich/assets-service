function routes (app) {
  const authCheck = require('../middleware/auth-check')
  const editorCheck = require('../middleware/editor-check')

  app.use(authCheck, editorCheck)

  function empty (_, res) {
    return res.status(200).jsonp({ message: 'endpoint not yet exists' }).end()
  }

  app
    .get('/api/assets', empty)
    .post('/api/assets', empty)
    .put('/api/assets/:storageId', empty)
    .delete('/api/assets/:storageId', empty)
    .get('/api/assets/:storageId', empty)
    .post('/api/assets/:storageId', empty)
    .put('/api/assets/:storageId/:assetId', empty)
    .delete('/api/assets/:storageId/:assetId', empty)
}

module.exports = routes
