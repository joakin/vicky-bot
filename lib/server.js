const http = require('http')
const ecstatic = require('ecstatic')

http.createServer(
  ecstatic({ root: __dirname + '/../public' })
).listen(process.env.PORT || 3000)
