const HangoutsBot = require('hangouts-bot')
const commands = require('./commands')

module.exports = function (user, password) {
  const bot = new HangoutsBot(user, password)
  const send = bot.sendMessage.bind(bot)

  const message = require('./message')('hangouts', commands, send)

  bot.on('online', () => { console.log('online') })

  bot.on('message', (from, msg) => message(from, msg))
  return { bot, send }
}

