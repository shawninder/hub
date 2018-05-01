const log = require('./log')
const stopParty = require('./stopParty')

module.exports = exports = function handleHostDisconnect ({ client, req, parties }) {
  return () => {
    const party = parties[req.name]
    if (party) {
      party.timer = setTimeout(() => {
        // TODO separate the various concerns out of functions like stopParty
        stopParty({ req, resolve: () => {}, reject: log, parties })
      }, 20 * 60 * 1000)
    }
  }
}
