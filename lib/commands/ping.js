module.exports = function () {
  return function (from, msg) {
    if (/^ping$/i.test(msg)) {
      return ['pong']
    }
  }
}
