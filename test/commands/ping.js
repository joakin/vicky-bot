const test = require('tape')
const ping = require('../../lib/commands/ping')()

test('responds to ping', (t) => {
  t.plan(1)
  t.deepEqual(ping('someone', 'ping'), ['pong'], 'returns a pong message when receiving ping')
})
