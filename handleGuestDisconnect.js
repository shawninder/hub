const pull = require('lodash.pull')

module.exports = exports = function handleGuestDisconnect ({ client, req, parties }) {
  return () => {
    const party = parties[req.name]
    if (party) {
      delete party.guests[req.socketKey]
    }
  }
}
