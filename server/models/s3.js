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
          Prefix: path.slice(1)
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
  }

  async destroy() {

  }
}

module.exports = S3;
