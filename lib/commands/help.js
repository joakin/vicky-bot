
const help = `Here are some examples of things you can try:

    ping
    (s)earch Banana
    (sh)ow Barack Obama`

const intro = `Hi! I'm Vicky, the Wikipedia bot`

const nope = `I don't understand`

module.exports = function () {
  let introduced = false
  return function (from, msg) {
    if (/^.*$/i.test(msg)) {
      let res = (introduced ? [nope] : [intro]).concat(help)
      introduced = true
      return res
    }
  }
}
