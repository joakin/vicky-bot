
const help = `Here are some examples of things you can try:

    ping
    (s)earch Banana
    (sh)ow Barack Obama`

const intro = `Hi! I'm Vicky, the Wikipedia bot`

const nope = `I don't understand`

module.exports = function () {
  let ppl = {}
  return function (from, msg) {
    const introduced = (ppl[from] || {}).introduced
    if (/^.*$/i.test(msg)) {
      let res = (introduced ? [nope] : [intro]).concat(help)
      ppl[from] = { introduced: true }
      return res
    }
  }
}
