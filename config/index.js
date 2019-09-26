const editorsRoles = process.env.EDITORS_ROLES ? process.env.EDITORS_ROLES.split(',') : ['editor', 'admin']

module.exports = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost/assets-service',
  authService: {
    protocol: process.env.AUTH_SERVICE_PROTOCOL || 'http',
    url: process.env.AUTH_SERVICE_URL || 'localhost',
    port: process.env.AUTH_SERVICE_PORT || 9000,
  },
  internalServicesSecret: process.env.INTERNAL_SECRET,
  secretsToken: process.env.SECRETS_TOKEN,
  secretsService: {
    protocol: process.env.SECRETS_SERVICE_PROTOCOL || 'http',
    url: process.env.SECRETS_SERVICE_URL || 'localhost',
    port: process.env.SECRETS_SERVICE_PORT || 9002,
  },
  editorsRoles
}
