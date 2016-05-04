const email = 'vickypediabot@gmail.com'
const password = process.env.HANGOUTSPASSWORD

const message = require('./lib/message')

const HangoutsBot = require('hangouts-bot')

const bot = new HangoutsBot(email, password)
const send = bot.sendMessage.bind(bot)

bot.on('online', () => { console.log('online') })

bot.on('message', (from, msg) => message(from, msg, send))
