const Client = require('hangupsjs')
const commands = require('./commands')

module.exports = function (token, user, password) {
  const client = new Client()
  // client.loglevel('debug')

  let gaia_id = null

  const send = (from, msg) => {
    console.log('send', from, msg)
    let bld = new Client.MessageBuilder()
    if (msg.constructor === Array) {
      msg.forEach((txt) => bld.text(txt).linebreak())
    }
    if (msg.constructor === String) {
      bld.text(msg)
    }
    client.sendchatmessage(from, bld.toSegments())
  }

  const message = require('./message')('hangouts', commands, send)

  // console.log(Client.OAUTH2_LOGIN_URL)

  const reconnect = () =>
    client.connect(() => ({auth: () => Promise.resolve(token)}))
      .then(() => { gaia_id = client.init.self_entity.id.gaia_id })

  client.on('chat_message', function (ev) {
    // Ignore own messages
    if (ev.sender_id.gaia_id === gaia_id) return

    const convo = ev.conversation_id.id
    const segment = ev.chat_message.message_content.segment
    segment
      .filter((s) => s.type === 'TEXT')
      .map((s) => s.text)
      .forEach((text) => message(convo, text))
  })

  // whenever it fails, we try again
  client.on('connect_failed', () =>
    // backoff for 3 seconds
    setTimeout(() => reconnect(), 3000))

  // start connection
  reconnect()

  // bot.on('message', (from, msg) => message(from, msg))

  return { send }
}
