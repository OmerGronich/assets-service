const path = require('path')
const uniqid = require('uniqid')
const Ftp = require('../models/ftp')

async function loadFiles (storage, identifier = '/') {
  const ftp = new Ftp(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier)

  await ftp.ready
  const list = await ftp.list(fullPath)

  // run on background
  // TODO: reuse storage connection
  ftp.destroy()

  return list
}

async function uploadFile (storage, {identifier, file, extension, prefix}) {
  const ftp = new Ftp(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier, `${prefix}-${uniqid()}.${extension}`)
  try {
    await ftp.ready
    await ftp.upload(fullPath, file)
  } catch (e) {
    throw new Error('failed to upload asset to: ' + fullPath)
  }

  // run on background
  // TODO: reuse storage connection
  ftp.destroy()

  const publicUrl = new URL(identifier, storage.metadata.publicUrl)

  return { success: true, publicUrl }
}

async function removeFile (storage, identifier) {
  const ftp = new Ftp(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier)

  await ftp.ready
  await ftp.remove(fullPath)

  // run on background
  // TODO: reuse storage connection
  ftp.destroy()

  return { success: true }
}

module.exports = {
  loadFiles,
  removeFile,
  uploadFile
}
