const commands = [
  require('./commands/ping'),
  require('./commands/search')
]

module.exports = function (from, message, send) {
  for (var i = 0; i < commands.length; i++) {
    const cmd = commands[i]
    const resp = cmd(message)
    if (resp) {
      resp.forEach((msg) => {
        if (msg instanceof Promise) {
          msg.then((msg2) => send(from, msg2))
            .catch((msg2) => send(from, msg2))
        } else {
          send(from, msg)
        }
      })
      break;
    }
  }
}
