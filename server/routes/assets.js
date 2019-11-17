const path = require('path')
const Ftp = require('../models/ftp')

function getStorageAssets (req, res) {
  const kind = req.storage.kind
  const identifier = req.query.identifier

  if (kind === 'ftp') {
    const storage = new Ftp(req.storage)
    storage.ready()
      .then(() => {
        return storage.list(path.join(req.storage.metadata.basePath || '/', identifier || '/'))
      })
      .then(list => res.json(list).end())
  } else {
    return res.end()
  }
}

module.exports = { getStorageAssets }
