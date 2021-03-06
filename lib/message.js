module.exports = function (service, commands, send) {
  let activeCommand = null
  let smartSend = (from, msg) => {
    if (msg.constructor === Promise) {
      msg.then((msg2) => send(from, msg2))
        .catch((msg2) => send(from, msg2))
    } else if (msg.constructor === Object) {
      switch (msg.type) {
        case 'command':
          processMessage(from, msg.value)
          break
      }
    } else {
      // Strings or arrays
      send(from, msg)
    }
  }

  return processMessage

  function processMessage (from, message) {
    console.log(from, message)
    try {
      if (activeCommand) {
        const resp = commands[activeCommand](from, message)
        if (resp) {
          sendResponses(smartSend, from, resp)
        } else {
          processMessageWithCommands(from, message, commands, smartSend)
          activeCommand = null
        }
      } else {
        processMessageWithCommands(from, message, commands, smartSend)
      }
    } catch (e) {
      smartSend(from, 'ERROR: ' + e.message)
    }
  }
}

function processMessageWithCommands (from, message, commands, send) {
  for (var i = 0; i < commands.length; i++) {
    const cmd = commands[i]
    const resp = cmd(from, message)
    if (resp) {
      sendResponses(send, from, resp)
      break
    }
  }
}

function sendResponses (send, from, resps) {
  resps.forEach((msg) => {
    send(from, msg)
  })
}
