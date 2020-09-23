function joinUrl (baseUrl, relativePath) {
  const base = baseUrl.endsWith('/') ? baseUrl : (baseUrl + '/')

  return `${base}${(relativePath.startsWith('/') ? relativePath.substr(1) : relativePath)}`
}

module.exports = { joinUrl }
