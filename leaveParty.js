const pull = require('lodash.pull')
const log = require('./log')

module.exports = exports = function leaveParty ({ req, resolve, reject, client, parties }) {
  if (parties[req.name]) {
    if (parties[req.name].guests.includes(client)) {
      pull(parties[req.name].guests, client)
      resolve()
      log(`${req.socketKey} left ${req.name}`)
    } else {
      reject("Can't leave party, you're not attending!")
    }
  } else {
    reject(`Can't leave party "${req.name}", it doesn't exist!`)
  }
}
