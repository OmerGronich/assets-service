const path = require('path')
const Ftp = require('../models/ftp')

async function loadFiles (storage, identifier) {
  const ftp = new Ftp(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier || '/')

  await ftp.ready
  const list = await ftp.list(fullPath)

  // run on background
  // TODO: reuse storage connection
  ftp.destroy()

  return list
}

async function removeFile (storage, identifier) {
  if (!identifier) {
    throw new Error('Must supply asset identifier to remove')
  }
  const ftp = new Ftp(storage)
  const fullPath = path.join(storage.metadata.basePath || '/', identifier);

  await ftp.ready
  await ftp.remove(fullPath)

  // run on background
  // TODO: reuse storage connection
  ftp.destroy()

  return { success: true }
}

module.exports = {
  loadFiles,
  removeFile
}
