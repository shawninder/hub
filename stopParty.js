const log = require('./log')

module.exports = exports = function stopParty ({ req, resolve, reject, parties }) {
  log({
    name: 'Host wants to stop party',
    host: req.socketKey,
    party: req.name
  })
  const party = parties[req.name_lc]
  if (party) {
    Object.keys(party.guests).forEach((guestKey) => {
      const guest = party.guests[guestKey]
      const action = {
        type: 'Party:ended'
      }
      log({
        name: 'Emitting dispatch to guest',
        guest: guestKey,
        action
      })
      guest.emit('dispatch', action)
    })
    delete parties[req.name_lc]
    resolve()
    log({
      name: 'Party deleted',
      party: req.name
    })
  } else {
    reject("Can't stop party, it doesn't exist!")
  }
}
