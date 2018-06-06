const pull = require('lodash.pull')
const log = require('./log')

module.exports = exports = function handleGuestDisconnect ({ client, req, parties }) {
  return () => {
    log(`Guest "${req.socketKey}" disconnected`)
    const party = parties[req.name]
    if (party) {
      delete party.guests[req.socketKey]
      log(`Guest "${req.socketKey}" removed from party "${req.name}"`)
    }
  }
}
