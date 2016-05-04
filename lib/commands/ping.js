module.exports = function (msg) {
  if (/^ping$/.test(msg.toLowerCase())) {
    return ['pong']
  }
}
