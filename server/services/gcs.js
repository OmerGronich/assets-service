const path = require('path')
const uniqid = require('uniqid')
const ASSET_TYPES = require('../../helpers/asset-types.json')
const { isImage, joinUrl } = require('./url')
const Gcs = require('../models/gcs')

function getAssetType(metadata) {
  return isImage(metadata.name) ? ASSET_TYPES.IMAGE : metadata.kind
}

async function loadFiles(storage, identifier = '/') {
  const gcs = new Gcs(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier)

  let list
  try {
    await gcs.ready
    list = await gcs.list(fullPath)
  } catch (e) {
    throw new Error(e.message || 'failed to get list of assets from: ' + fullPath)
  } finally {
    // run on background
    // TODO: reuse storage connection
    gcs.destroy()
  }

  return list.map((asset) => {
    const fileIdentifier = path.join(identifier, asset.metadata.name)

    return {
      name: asset.metadata.name,
      identifier: fileIdentifier,
      updated: asset.metadata.updated,
      type: getAssetType(asset.metadata),
      publicUrl: joinUrl(storage.metadata.publicUrl, fileIdentifier)
    }
  })
}

async function uploadFile(storage, { identifier, file, extension, prefix }) {
  const gcs = new Gcs(storage)
  const filename = `${prefix}-${uniqid()}.${extension}`
  const fullPath = path.join(storage.metadata.basePath || '/', identifier, filename)

  try {
    await gcs.ready
    await gcs.upload(fullPath, file)
  } catch (e) {
    throw new Error(e.message || 'failed to upload asset to: ' + fullPath)
  } finally {
    // run on background
    // TODO: reuse storage connection
    gcs.destroy()
  }

  return { success: true, publicUrl: joinUrl(storage.metadata.publicUrl, path.join(identifier, filename)) }
}

async function removeFile(storage, identifier) {
  const gcs = new Gcs(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier)

  try {
    await gcs.ready
    await gcs.remove(fullPath)
  } catch (e) {
    throw new Error(e.message || 'failed to remove asset: ' + fullPath)
  } finally {
    // run on background
    // TODO: reuse storage connection
    gcs.destroy()
  }

  return { success: true }
}

module.exports = {
  loadFiles,
  removeFile,
  uploadFile
}
