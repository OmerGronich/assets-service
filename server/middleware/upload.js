const multer = require('multer')
const uniqid = require('uniqid')
const { tempFolder } = require('../../config')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempFolder)
  },
  filename (req, file, callback) {
    const { prefix, extension } = req.query || {}
    const filePath = `${prefix}-${uniqid()}.${extension}`

    callback(null, filePath)
  }
})
const upload = multer({ storage })

module.exports = upload;
