const app = require('@greenpress/api-kit').app();
const upload = require('../middleware/upload');
const { getStorageById } = require('../controllers/storage');
const {
  getStorageAssets,
  removeStorageAsset,
  verifyIdentifier,
  uploadStorageAssets,
  renameStorageAssets
} = require('../controllers/assets');

function empty(_, res) {
  return res.status(200).json({ message: 'endpoint not yet exists' }).end();
}

app
  .get('/api/assets/:storageId', getStorageById, getStorageAssets)
  .post('/api/assets/:storageId', getStorageById, verifyIdentifier, upload.any(), uploadStorageAssets)
  .put('/api/assets/:storageId', getStorageById, verifyIdentifier, renameStorageAssets)
  .delete('/api/assets/:storageId', getStorageById, verifyIdentifier, removeStorageAsset);
