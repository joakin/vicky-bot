module.exports = function (msg) {
  if (/^ping$/.test(msg)) {
    return ['pong']
  }
}
