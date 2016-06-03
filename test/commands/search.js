const test = require('tape')
const Search = require('../../lib/commands/search')

test('only matches s or search', (t) => {
  t.plan(3)
  t.ok(Search()('someone', 's Banana'), 'matches the s alias')
  t.ok(Search()('someone', 'SEArch Banana'), 'matches search')
  t.notOk(Search()('someone', 'whatever'))
})

test('returns in-progress cmd and a promise for the results', (t) => {
  t.plan(3)
  const results = Search()('someone', 's Banana')
  t.equal(results.length, 2, 'returns two messages')
  t.equal(typeof results[0], 'string', 'first message is a string')
  t.ok(results[1] instanceof Promise, 'second message is a promise')
})

test('the promise results end up having a msg with the results', (t) => {
  t.plan(2)
  const results = Search()('someone', 's Banana')
  results[1].then((msg) => {
    t.equal(msg.substring(0, 31), 'a )  Banana\nb )  Banana ketchup')
    t.equal(msg.split('\n').length, 10)
  })
})

test("doesn't respond to input while it is searching", (t) => {
  t.plan(1)
  const search = Search()
  search('someone', 's Banana')
  t.deepEqual(search('someone', 'whaeva'), [])
})

test('after shown results, you can search again', (t) => {
  t.plan(1)
  const search = Search()
  const results = search('someone', 's Banana')
  results[1].then((msg) => {
    const results2 = search('someone', 'S Banana')
    t.equal(results2.length, 2)
  })
})

test('after shown results, you can choose an option and trigger a command', (t) => {
  t.plan(3)
  const search = Search()
  search('someone', 's Banana')[1].then((msg) => {
    const results2 = search('someone', 'E')
    t.deepEqual(results2, [{
      type: 'command',
      value: 'show Banana split'
    }])
    t.notOk(search('someone', 'b'), 'we are free from option selecting')
    t.equal(search('someone', 's Banana').length, 2, 'we can search again')
  })
})
