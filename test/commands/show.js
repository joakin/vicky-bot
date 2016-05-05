const test = require('tape')
const Show = require('../../lib/commands/show')

const show = Show()

test('only matches sh and show commands', (t) => {
  t.plan(3)
  t.ok(show('someone', 'sh Banana'))
  t.ok(show('someone', 'show Banana'))
  t.notOk(show('someone', 'banana'))
})

test('returns an in-progress message and a promise for the result', (t) => {
  t.plan(3)
  const results = show('someone', 'sh Banana')
  t.equal(results.length, 2, 'returns two messages')
  t.equal(typeof results[0], 'string', 'first message is a string')
  t.ok(results[1] instanceof Promise, 'second message is a promise')
})

test('the promise message resolves to the result of the show', (t) => {
  t.plan(1)
  const results = show('someone', 'sh Banana')
  results[1].then((msg) => {
    t.equal(msg.substring(0, 37), 'Banana\n\nThe banana is an edible fruit')
  })
})
