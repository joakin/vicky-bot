const test = require('tape')
const Help = require('../../lib/commands/help')

test('shows two help messages', (t) => {
  t.plan(1)
  const results = Help()('someone', 'whatever')
  t.equal(results.length, 2, 'it returns 2 help messages')
})

test('salutes the first time contacted by a user', (t) => {
  t.plan(2)
  const help = Help()

  const results = help('someone', 'whatever')
  t.ok(results[0].indexOf('Hi!') === 0, 'first message is a salutation')

  const results2 = help('someone else', 'whatever')
  t.ok(results2[0].indexOf('Hi!') === 0, 'first message is a salutation')
})

test("doesn't salute after the first time contacted by a user", (t) => {
  t.plan(2)
  const help = Help()

  t.ok(help('someone', 'whatever')[0].indexOf('Hi!') === 0, 'first message is a salutation')
  t.ok(help('someone', 'whatever')[0].indexOf('Hi!') === -1, 'second message is not a salutation')
})
