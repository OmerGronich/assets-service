const mongoose = require('mongoose')
const config = require('../../config')

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
  authentication: String,
  salt: String
})

module.exports = mongoose.model('Storage', StorageSchema)
