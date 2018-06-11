const log = require('./log')

module.exports = exports = function stopParty ({ req, resolve, reject, parties }) {
  log(`Host "${req.socketKey}" wants to stop party "${req.name}"`)
  const party = parties[req.name_lc]
  if (party) {
    Object.keys(party.guests).forEach((guestKey) => {
      const guest = party.guests[guestKey]
      const action = {
        type: 'Party:ended'
      }
      log(`Emitting 'dispatch' to guest ${guestKey}`, action)
      guest.emit('dispatch', action)
    })
    delete parties[req.name_lc]
    resolve()
    log(`Party "${req.name}" was deleted`)
  } else {
    reject("Can't stop party, it doesn't exist!")
  }
}
