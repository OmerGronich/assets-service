const AWS = require('aws-sdk');
const { getSecret } = require("../../helpers/secrets-management");

class S3 {
  constructor(storage) {
    this.name = storage.name;
    this.ready = getSecret(storage.tenant, storage.authentication).then(
      (decrypted) => {
        const { accessKeyId, secretAccessKey } = decrypted.value;

        AWS.config.setPromisesDependency();
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
      const { Contents } = await this._client
        .listObjectsV2({
          Bucket: this.bucket.name,
          Prefix: path
        })
        .promise();

      return Contents;

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
          Body: file,
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
        Prefix: file
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

  async rename(oldFile, newFileName) {
    try {

      await this._client
        .copyObject({
          Bucket: this.bucket.name,
          CopySource: `/${this.bucket.name}${oldFile}`,
          Key: newFileName
        })
        .promise();


      this._client.deleteObject({
          Bucket: this.bucket.name,
          Key: oldFile
        })
        .promise();


    } catch (e) {
      throw { message: 'could not rename asset from storage: ' + oldFile };
    }
  }

  async destroy() {

  }
}

module.exports = S3;
