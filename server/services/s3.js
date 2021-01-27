const S3 = require("../models/s3");
const uniqid = require('uniqid');
const path = require('path');
const { joinUrl } = require('./url');


async function uploadFile(storage, { identifier, file, extension, prefix }) {
  const s3 = new S3(storage);
  const filename = `${prefix}-${uniqid()}.${extension}`;
  const fullPath = path.join(storage.metadata.basePath || '/', identifier, filename);

  try {
    await s3.ready;
    await s3.upload(fullPath, file);
  } catch (e) {
    throw new Error(e.message || 'failed to upload asset to: ' + fullPath);
  } finally {
    // run on background
    // TODO: reuse storage connection
    s3.destroy();
  }

  return { success: true, publicUrl: joinUrl(storage.metadata.publicUrl, path.join(identifier, filename)) };
}

module.exports = {
  uploadFile
};
