const multer = require('multer')
const { tempFolder } = require('../../config')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempFolder)
  }
})
const upload = multer({ storage })

module.exports = upload;
