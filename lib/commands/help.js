module.exports = function () {
  return function (from, msg) {
    if (/^.*$/i.test(msg)) {
      return [
        `Hi! I'm Vicky, the Wikipedia bot`,
        `Here are some examples of things you can try:

    ping
    (s)earch Banana
    (sh)ow Barack Obama`
      ]
    }
  }
}
