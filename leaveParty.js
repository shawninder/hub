const pull = require('lodash.pull')
const log = require('./log')

module.exports = exports = function leaveParty ({ req, resolve, reject, client, parties }) {
  if (parties[req.name]) {
    if (parties[req.name].guests[req.socketKey]) {
      delete parties[req.name].guests[req.socketKey]
      resolve()
      log(`${req.socketKey} left ${req.name}`)
    } else {
      reject("Can't leave party, you're not attending!")
    }
  } else {
    reject(`Can't leave party "${req.name}", it doesn't exist!`)
  }
}
