const test = require('tape')
const ping = require('../../lib/commands/ping')()

test('only responds to ping', (t) => {
  t.plan(2)
  t.deepEqual(ping('someone', 'ping'), ['pong'], 'returns a pong message when receiving ping')
  t.notOk(ping('someone', 'pingoo'), 'returns a pong message when receiving ping')
})
