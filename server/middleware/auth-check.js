const authService = require('@greenpress/api-kit/internal-service').service('AUTH')

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end()
  }

  return authService({
    url: '/api/me',
    headers: {
      authorization: req.headers.authorization,
    }
  })
    .then(res => {
      req.user = res.data
      return next()
    })
    .catch(() => {
      return res.status(401).end()
    })
}
