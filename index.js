const email = 'vickypediabot@gmail.com'
const password = process.env.HANGOUTSPASSWORD

require('./lib/server')

if (process.env.NODE_ENV === 'production') {
  const HangoutsBot = require('hangouts-bot')

  const bot = new HangoutsBot(email, password)
  const send = bot.sendMessage.bind(bot)

  const commands = require('./lib/commands')
  const message = require('./lib/message')(commands, send)

  bot.on('online', () => { console.log('online') })

  bot.on('message', (from, msg) => message(from, msg))
}
