const log = require('./log')
const stopParty = require('./stopParty')

const ms = 20 * 60 * 1000

module.exports = exports = function handleHostDisconnect ({ client, req, parties }) {
  return () => {
    const party = parties[req.name_lc]
    log(`Host "${req.socketKey}" ("${client.id}") disconnected`, party ? `from existing party ${req.name}` : undefined)
    if (party) {
      log(`Initiating self destruct of "${req.name}" in ${ms}ms`)
      party.timer = setTimeout(() => {
        // TODO separate the various concerns out of functions like stopParty
        stopParty({ req, resolve: () => {}, reject: log, parties })
      }, ms)
    }
  }
}
