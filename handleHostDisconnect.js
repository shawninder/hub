const log = require('./log')
const stopParty = require('./stopParty')

const ms = 20 * 60 * 1000

module.exports = exports = function handleHostDisconnect ({ client, req, parties }) {
  return () => {
    const party = parties[req.name_lc]
    log({
      name: 'Host disconnected',
      client: client.id,
      wasHosting: req.name,
      host: req.socketKey
    })
    if (party) {
      log({
        name: 'Initiating party self-destruct',
        party: req.name,
        in: ms
      })
      party.timer = setTimeout(() => {
        // TODO separate the various concerns out of functions like stopParty
        stopParty({ req, resolve: () => {}, reject: log, parties })
      }, ms)
    }
  }
}
