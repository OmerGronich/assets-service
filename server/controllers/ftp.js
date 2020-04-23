const path = require('path')
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

async function uploadFile (storage, identifier, file) {
  const ftp = new Ftp(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier)

  await ftp.ready
  await ftp.upload(fullPath, file)

  // run on background
  // TODO: reuse storage connection
  ftp.destroy()

  return { success: true }
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
