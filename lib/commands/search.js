const https = require('https')
const querystring = require('querystring')
const concat = require('concat-stream')

const LIMIT = 10
const CHARS = 'abcdefghijklmnopqrstuvwxyz'
const CHARSREGEXP = /^[a-z]$/i
const cmdkey = /^(s|search) (.*)/i

module.exports = function () {
  let ppl = {}
  return function (from, msg) {
    const match = msg.match(cmdkey)
    if (match) {
      const terms = match[2]

      ppl[from] = {
        status: 'searching',
        q: terms
      }

      const results = search(terms)
        .then((res) => {
          if (ppl[from].status === 'searching' && ppl[from].q === terms) {
            ppl[from] = {
              status: 'results',
              results: res.pages.reduce((a, v, i) => {
                a[CHARS[i]] = v.title
                return a
              }, {})
            }
            return res.pages.map((p, i) => `${CHARS[i]} )  ${p.title}`)
          }
        })
      return [`Searching for ${terms}`, results]
    } else if (ppl[from] && ppl[from].status === 'searching') {
      // If searching swallow input until we return
      return []
    } else if (
      ppl[from] && ppl[from].status === 'results'
    ) {
      const validKeys = Object.keys(ppl[from].results)
      const lowerMsg = msg.toLowerCase()
      if (CHARSREGEXP.test(msg) && validKeys.indexOf(lowerMsg) !== -1) {
        ppl[from].status = null
        return [{ type: 'command', value: `show ${ppl[from].results[lowerMsg]}` }]
      } else {
        return [
          "I don't understand. Select an option of " +
          validKeys.join(', ')
        ]
      }
    }
  }
}

function createOptions (query, limit) {
  return {
    protocol: 'https:',
    host: 'en.wikipedia.org',
    path: '/w/api.php?' + querystring.stringify({
      action: 'query',

      format: 'json',
      formatversion: 2,

      prop: 'pageprops',
      ppprop: 'displaytitle',

      redirects: '',

      generator: 'search',
      gsrnamespace: 0,
      gsrsearch: query,
      gsrlimit: limit
    })
  }
}

function search (query) {
  return new Promise((resolve, reject) => {
    https.get(createOptions(query, LIMIT), (res) => {
      res.pipe(concat((json) => resolve(transform(JSON.parse(json)))
      ))
    })
      .on('error', (e) => reject(e))
  })
}

function transform (results) {
  var redirects = {}
  var result = {
    pages: []
  }

  if (!results.query) {
    return result
  }

  if (results.query.redirects) {
    // Generate a map of result index to the title (String) of the page the redirect is from.
    results.query.redirects.forEach((redirect) => {
      redirects[redirect.index] = redirect.from
    })
  }

  if (results.query.pages) {
    result.pages = new Array(results.query.pages.length)

    results.query.pages.forEach((page) => {
      var newPage = {}

      result.pages[page.index - 1] = newPage

      // Has a redirect been followed?
      if (redirects[page.index]) {
        newPage.redirected_from = redirects[page.index]
      }

      newPage.title = page.title

      if (page.pageprops) {
        newPage.title_html = page.pageprops.displaytitle
      }
    })
  }

  return result
}
