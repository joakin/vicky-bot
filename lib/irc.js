const irc = require('irc')
const commands = require('./commands')

module.exports = function (server, channels, user, password) {
  const client = new irc.Client(server, user, {
    userName: user,
    password,
    channels,
    autoRejoin: true,
    floodProtection: true,
    floodProtectionDelay: 250
  })

  const userNameRegexp = new RegExp(`^${user}:? (.*)$`, 'i')

  const send = (from, msg) => client.say(from, msg)

  const message = require('./message')('irc', commands, send)

  client.join(channels.join(' '))

  client.addListener('error', (message) => console.log('error: ', message))

  client.addListener('join', (ch, nck) => {
    if (nck === user) console.log(`JOINED ${ch} as ${nck}`)
  })

  client.addListener('message', (from, to, text, msg) => {
    if (to === user) {
      message(from, text)
    } else if (channels.indexOf(to) !== -1) {
      const match = text.match(userNameRegexp)
      if (match) {
        message(to, match[1])
      }
    }
  })
}
