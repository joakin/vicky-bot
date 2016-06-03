const HangoutsBot = require('./hangouts-bot')
const commands = require('./commands')

module.exports = function (user, password) {
  const bot = new HangoutsBot(user, password)
  const send = bot.sendMessage.bind(bot)

  const message = require('./message')('hangouts', commands, send)

  bot.on('online', () => {
    console.log('online')
  })

  bot.on('message', (from, msg) => message(from, msg))

  bot.on('offline', function () {
    console.log('offline')
  })

  bot.on('connect', function () {
    console.log('connected')
  })

  bot.on('reconnect', function () {
    console.log('reconnecting …')
  })

  bot.on('disconnect', function (reconnect, e) {
    console.log('disconnected', reconnect, e)
  })

  bot.on('error', function (e) {
    console.error(e)
  })

  return { bot, send }
}
