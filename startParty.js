const log = require('./log')
const handleSlice = require('./handleSlice')
const handleHostDisconnect = require('./handleHostDisconnect')

module.exports = exports = function startParty ({ req, resolve, reject, client, parties }) {
  log({
    name: 'Host wants to start a party',
    host: req.socketKey,
    party: req.name,
    req
  })
  if (parties[req.name_lc]) {
    reject({ name: "Can't start party, it already exists!" })
  } else {
    if (req.socketKey) {
      client.on('slice', handleSlice({ client, req, parties }))
      client.on('disconnect', handleHostDisconnect({ client, req, parties }))
      parties[req.name_lc] = {
        host: {
          client,
          key: req.socketKey
        },
        guests: {},
        state: req.state,
        name: req.name
      }
      resolve()
      log({
        name: 'Host started party',
        host: req.socketKey,
        party: req.name
      })
    } else {
      reject({ name: "Can't start party, no socketKey" })
    }
  }
}
