const { internalServicesSecret, secretsToken } = require('../config')
const { callInternalService, SERVICES } = require('./internal-service')

function callSecretsService (url, key, value) {
  return callInternalService(SERVICES.secrets, {
    headers: { internal_secret: internalServicesSecret },
    method: 'POST',
    data: {
      key,
      value,
      token: secretsToken
    },
    url
  })
    .then(axiosRes => axiosRes.data)
}

function getSecret (key) {
  return callSecretsService('/api/secrets/get', key)
}

function setSecret (key, value) {
  return callSecretsService('/api/secrets/set', key, value)
}

module.exports = { getSecret, setSecret }
