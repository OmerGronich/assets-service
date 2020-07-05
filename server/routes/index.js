const app = require('@greenpress/api-kit').app()

const authCheck = require('../middleware/auth-check')
const editorCheck = require('../middleware/editor-check')

app.use(authCheck, editorCheck);
require('./assets')
require('./storage')
