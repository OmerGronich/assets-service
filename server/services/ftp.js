const path = require('path')
const uniqid = require('uniqid')
const Ftp = require('../models/ftp')
const { joinUrl } = require('./url')

async function loadFiles (storage, identifier = '/') {
  const ftp = new Ftp(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier)

  let list
  try {
    await ftp.ready
    list = await ftp.list(fullPath)
  } catch (e) {
    throw new Error(e.message || 'failed to get list of assets from: ' + fullPath)
  } finally {
    // run on background
    // TODO: reuse storage connection
    ftp.destroy()
  }

  return list
}

async function uploadFile (storage, { identifier, file, extension, prefix }) {
  const ftp = new Ftp(storage)
  const filename = `${prefix}-${uniqid()}.${extension}`
  const fullPath = path.join(storage.metadata.basePath || '/', identifier, filename)

  try {
    await ftp.ready
    await ftp.upload(fullPath, file)
  } catch (e) {
    throw new Error(e.message || 'failed to upload asset to: ' + fullPath)
  } finally {
    // run on background
    // TODO: reuse storage connection
    ftp.destroy()
  }

  return { success: true, publicUrl: joinUrl(storage.metadata.publicUrl, path.join(identifier, filename)) }
}

async function removeFile (storage, identifier) {
  const ftp = new Ftp(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier)

  try {
    await ftp.ready
    await ftp.remove(fullPath)
  } catch (e) {
    throw new Error(e.message || 'failed to remove asset: ' + fullPath)
  } finally {
    // run on background
    // TODO: reuse storage connection
    ftp.destroy()
  }

  return { success: true }
}

module.exports = {
  loadFiles,
  removeFile,
  uploadFile
}
