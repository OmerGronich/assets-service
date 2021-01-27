const AWS = require('aws-sdk');
const { getSecret } = require("../../helpers/secrets-management");

class S3 {
  constructor(storage) {
    this.name = storage.name;
    this.ready = getSecret(storage.tenant, storage.authentication).then(
      (decrypted) => {
        const auth = decrypted.value;

        AWS.config.update({
          accessKeyId: "<Access Key Here>",
          secretAccessKey: "<Secret Access Key Here>"
        });

        this._client = new AWS.S3();
        this.bucket = this._client.bucket(storage.metadata.bucketName);

        console.log(this._client, 'this._client');
        console.log(this.bucket, 'this.bucket');
      },
      () => {
        throw new Error('could not read AWS credentials');
      }
    );
  }

  async list(path) {

  }

  async upload(fullPath, file) {

  }

  async remove(file) {
  }

  async destroy() {

  }
}

module.exports = S3;
