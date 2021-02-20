const { Storage } = require('@google-cloud/storage');
const { getSecret } = require('../../helpers/secrets-management');

class Gcs {
  constructor(storage) {
    this.name = storage.name;
    this.ready = getSecret(storage.tenant, storage.authentication).then(
      (decrypted) => {
        const auth = decrypted.value;
        this._client = new Storage({
          projectId: auth.projectId,
          scopes: 'https://www.googleapis.com/auth/cloud-platform',
          credentials: {
            client_email: auth.clientEmail,
            private_key: auth.privateKey
          }
        });
        this.bucket = this._client.bucket(storage.metadata.bucketName);
      },
      () => {
        throw new Error('could not read GCS credentials');
      }
    );
  }

  async list(path) {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: path.slice(1)
      });
      return files;
    } catch (error) {
      throw { message: 'could not retrieve assets from storage: ' + this.name };
    }
  }

  /**
   *
   * @param fullPath
   * @param file {Buffer}
   * @returns {Promise<void>}
   */
  async upload(fullPath, file) {
    try {
      const remoteWriteStream = this.bucket.file(fullPath.slice(1)).createWriteStream();
      await new Promise((resolve, reject) => {
        remoteWriteStream
          .on('error', reject)
          .on('finish', resolve)
          .write(file);
        remoteWriteStream.end();
      });
    } catch (error) {
      throw { message: 'could not upload asset to storage: ' + this.name };
    }
  }

  async remove(file) {
    try {
      await this.bucket.file(file.slice(1)).delete();
    } catch (error) {
      throw { message: 'could not remove asset from storage: ' + file };
    }
  }

  async destroy() {
    try {
      // await this.bucket.???
    } catch (error) {
      throw { message: 'could not remove bucket from storage: ' + this.name };
    }
  }
}

module.exports = Gcs;
