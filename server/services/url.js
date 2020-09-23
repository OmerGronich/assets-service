function joinUrl (baseUrl, relativePath) {
  baseUrl = baseUrl.endsWith('/') ? baseUrl : (baseUrl + '/')

  return baseUrl + relativePath.startsWith('/') ? relativePath.substr(1) : relativePath
}

module.exports = { joinUrl }
