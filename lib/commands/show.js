const https = require('https')
const querystring = require('querystring')
const concat = require('concat-stream')

const cmdkey = /^(sh|show) (.*)/i

module.exports = function () {
  return function (from, msg) {
    const match = msg.match(cmdkey)
    if (match) {
      const title = match[2]

      const result = show(title)
        .then((res) => [
          res.title,
          res.extract,
          `http://en.m.wikipedia.org/wiki/${encodeURIComponent(res.title)}`
        ])
      return [`Showing ${title}`, result]
    }
  }
}

function createOptions (query) {
  return {
    protocol: 'https:',
    host: 'en.wikipedia.org',
    path: '/api/rest_v1/page/summary/' + encodeURIComponent(query.replace(/ /g, '_'))
  }
}

function show (query) {
  return new Promise((resolve, reject) => {
    https.get(createOptions(query), (res) => {
      if (res.statusCode > 400) {
        reject(new Error(res.statusCode))
      } else if (res.statusCode === 301) {
        return show(res.headers.location)
      } else if (res.statusCode === 200) {
        res.pipe(concat((json) => resolve(Object.assign({}, JSON.parse(json), {status: res.statusCode}))
        ))
      }
    })
      .on('error', (e) => reject(e))
  })
}
