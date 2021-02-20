const S3 = require("../models/s3");
const uniqid = require('uniqid');
const path = require('path');
const ASSET_TYPES = require('../../helpers/asset-types.json');
const { joinUrl, isImage } = require('./url');


function getAssetType(asset) {
  return isImage(asset.Key) ? ASSET_TYPES.IMAGE : asset.metadata.ContentType;
}

async function uploadFile(storage, { identifier, file, extension, prefix, type }) {
  const s3 = new S3(storage);
  const filename = `${prefix}-${uniqid()}.${extension}`;
  const fullPath = path.join(storage.metadata.basePath || '/', identifier, filename);

  try {
    await s3.ready;
    await s3.upload(fullPath, { buffer: file, type });
  } catch (e) {
    throw new Error(e.message || 'failed to upload asset to: ' + fullPath);
  } finally {
    // run on background
    // TODO: reuse storage connection
    s3.destroy();
  }

  return { success: true, publicUrl: joinUrl(storage.metadata.publicUrl, path.join(identifier, filename)) };
}

async function loadFiles(storage, identifier = '/') {

  const s3 = new S3(storage);
  const fullPath = path.join(storage.metadata.basePath || '/', identifier);

  let list;
  try {
    await s3.ready;
    list = await s3.list(fullPath);
  } catch (e) {
    throw new Error(e.message || 'failed to get list of assets from: ' + fullPath);
  } finally {
    // run on background
    // TODO: reuse storage connection
    s3.destroy();
  }

  return list.map((asset) => {
    const fileIdentifier = path.join(identifier, asset.Key);

    return {
      name: asset.Key,
      identifier: fileIdentifier,
      updated: asset.LastModified,
      type: getAssetType(asset),
      publicUrl: joinUrl(storage.metadata.publicUrl, fileIdentifier)
    };
  });
}

async function removeFile(storage, identifier) {
  const s3 = new S3(storage);
  const fullPath = path.join(storage.metadata.basePath || '/', identifier);

  try {
    await s3.ready;
    await s3.remove(fullPath);
  } catch (e) {
    throw new Error(e.message || 'failed to remove asset: ' + fullPath);
  } finally {
    // run on background
    // TODO: reuse storage connection
    s3.destroy();
  }

  return { success: true };
}

async function renameFile(storage, identifier, newFileName) {
}

module.exports = {
  uploadFile,
  loadFiles,
  removeFile,
  renameFile
};
