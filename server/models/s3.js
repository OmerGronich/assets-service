const AWS = require('aws-sdk');
const { getSecret } = require("../../helpers/secrets-management");
const ASSET_TYPES = require('../../helpers/asset-types.json');

AWS.config.setPromisesDependency();

class S3 {
  constructor(storage) {
    this.name = storage.name;
    this.ready = getSecret(storage.tenant, storage.authentication).then(
      (decrypted) => {
        const { accessKeyId, secretAccessKey } = decrypted.value;

        this._client = new AWS.S3({
          accessKeyId,
          secretAccessKey
        });
        this.bucket = { name: storage.metadata.bucketName };

      },
      () => {
        throw new Error('could not read AWS credentials');
      }
    );
  }

  async list(path) {
    try {
      const listedObjects = await this._client
        .listObjectsV2({
          Bucket: this.bucket.name,
          Prefix: path,
          Delimiter: "/"
        })
        .promise();

      const headParams = {
        Bucket: this.bucket.name
      };

      const files = await Promise.all(listedObjects.Contents.map(async content => {
        headParams["Key"] = content.Key;
        const metadata = await this._client.headObject(headParams).promise();

        return { ...content, metadata };
      }));

      const folders = listedObjects.CommonPrefixes.map(({ Prefix }) => ({
        Key: Prefix,
        metadata: {
          ContentType: ASSET_TYPES.DIRECTORY
        }
      }));

      return [...files, ...folders];

    } catch (error) {
      throw { message: 'could not retrieve assets from storage: ' + this.name };
    }
  }

  async upload(fullPath, file) {
    try {
      this._client
        .upload({
          Bucket: this.bucket.name,
          Key: fullPath,
          Body: file.buffer,
          ContentType: file.type
        })
        .promise();

    } catch (error) {
      throw { message: 'could not upload asset to storage: ' + this.name };
    }
  }

  async remove(file) {
    try {
      const params = {
        Bucket: this.bucket.name,
        Prefix: file,
        Delimiter: "/"
      };

      const listedObjects = await this._client.listObjectsV2(params).promise();

      if (listedObjects.Contents.length === 0) return;

      const deleteParams = {
        Bucket: this.bucket.name,
        Delete: { Objects: [] }
      };

      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      await this._client.deleteObjects(deleteParams).promise();

      if (listedObjects.IsTruncated) await this.remove(file);

    } catch (error) {
      throw { message: 'could not remove asset from storage: ' + file };
    }
  }

  async rename(oldFile, newFile) {
    
  }

  async destroy() {

  }
}

module.exports = S3;
