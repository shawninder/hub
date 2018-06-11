const pull = require('lodash.pull')
const log = require('./log')

module.exports = exports = function handleGuestDisconnect ({ client, req, parties }) {
  return () => {
    log(`Guest "${req.socketKey}" ("${client.id}") disconnected from ${req.name}`)
    const party = parties[req.name_lc]
    if (party) {
      if (party.guests[req.socketKey]) {
        delete party.guests[req.socketKey]
        log(`Guest "${req.socketKey}" removed from party "${req.name}"`)
      }
    }
  }
}
