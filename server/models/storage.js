const mongoose = require('mongoose')

// define the Storage model schema
const StorageSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: ['s3', 'gcloud', 'ftp'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  authentication: String
})

module.exports = mongoose.model('StorageList.vue', StorageSchema)
