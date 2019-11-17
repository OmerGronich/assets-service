const Client = require('ftp')
const { getSecret } = require('../../helpers/secrets-management')

class Ftp {
  constructor (storage) {

    this.ready = getSecret(storage.authentication)
      .then(auth => {
        this._client = new Client()
        this._client.connect({
          host: auth.host,
          user: auth.username,
          password: auth.password
        })
        return new Promise((resolve, reject) => {
          this._client.on('ready', err => err ? reject(err) : resolve())
        })
      })
  }

  list (path) {
    return new Promise((resolve, reject) => {
      this._client.list(path, (err, list) => err ? reject(err) : resolve(list || []))
    })
  }

  destroy () {
    this._client.destroy()
  }
}

module.exports = Ftp
