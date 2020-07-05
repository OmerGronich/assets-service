const app = require('@greenpress/api-kit').app()
const upload = require('multer')()
const { getStorageById } = require('../controllers/storage')
const { getStorageAssets, removeStorageAsset, verifyIdentifier, uploadStorageAssets } = require('../controllers/assets')

function empty (_, res) {
  return res.status(200).json({ message: 'endpoint not yet exists' }).end()
}

app
  .get('/api/assets/:storageId', getStorageById, getStorageAssets)
  .post('/api/assets/:storageId', getStorageById, verifyIdentifier, upload.any(), uploadStorageAssets)
  .put('/api/assets/:storageId', getStorageById, empty) // update metadata, not the actual asset buffer
  .delete('/api/assets/:storageId', getStorageById, verifyIdentifier, removeStorageAsset)
