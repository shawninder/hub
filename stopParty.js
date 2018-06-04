const log = require('./log')

module.exports = exports = function stopParty ({ req, resolve, reject, parties }) {
  const party = parties[req.name]
  if (party) {
    Object.keys(party.guests).forEach((guestKey) => {
      const guest = party.guests[guestKey]
      guest.emit('dispatch', {
        type: 'Party:ended'
      })
    })
    delete parties[req.name]
    resolve()
    log(`Stopped party ${req.name}`)
  } else {
    reject("Can't stop party, it doesn't exist!")
  }
}
