const log = require('./log')

module.exports = exports = function handleGuestDisconnect ({ client, req, parties }) {
  return () => {
    log({
      name: 'Guest disconnected',
      party: req.name,
      client: client.id,
      guest: req.socketKey
    })
    const party = parties[req.name_lc]
    if (party) {
      if (party.guests[req.socketKey]) {
        delete party.guests[req.socketKey]
        log({
          name: 'Guest removed from party',
          party: req.name,
          guest: req.socketKey
        })
      }
    }
  }
}
