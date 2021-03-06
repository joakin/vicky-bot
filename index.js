const hangouts = require('./lib/hangouts')
const config = require(process.env.CONFIG || __dirname + '/conf.json')
const irc = require('./lib/irc')

// require('./lib/server')

if (process.env.NODE_ENV === 'production') {
  // No hangouts since it is very flaky
  // hangouts(config.hangouts.token, config.hangouts.user, config.hangouts.password)
  irc(config.irc.server, config.irc.channels, config.irc.user, config.irc.password)
}
