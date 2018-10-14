const log = require('./log')

module.exports = exports = function leaveParty ({ req, resolve, reject, client, parties }) {
  log({
    name: 'Guest wants to leave',
    guest: req.socketKey,
    party: req.name
  })
  if (parties[req.name_lc]) {
    if (parties[req.name_lc].guests[req.socketKey]) {
      delete parties[req.name_lc].guests[req.socketKey]
      resolve()
      log({
        name: 'Guest removed from party',
        guest: req.socketKey,
        party: req.name
      })
    } else {
      reject({ name: "Can't leave party, you're not attending!" })
    }
  } else {
    reject({ name: `Can't leave party "${req.name}", it doesn't exist!` })
  }
}
