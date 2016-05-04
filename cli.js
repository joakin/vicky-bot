const readline = require('readline')

const send = (from, msg) => console.log(msg)

const commands = require('./lib/commands')
const message = require('./lib/message')(commands, send)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', (line) => {
  message('cli', line)
})
