const express = require('express')
const serveIndex = require('serve-index')
const app = express()

app.use(serveIndex('./'))
app.use(express.static('./'))

app.listen(process.env.PORT || 8080)
