const log = require('./log')

module.exports = exports = function stopParty ({ req, resolve, reject, parties }) {
  const party = parties[req.name]
  if (party) {
    party.guests.forEach((guest) => {
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
