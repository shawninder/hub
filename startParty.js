const log = require('./log')
const handleSlice = require('./handleSlice')
const handleHostDisconnect = require('./handleHostDisconnect')
const handleHostRequestChunk = require('./handleHostRequestChunk')
const handleHostGotFile = require('./handleHostGotFile')

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
      client.on('requestChunk', handleHostRequestChunk({ client, req, parties }))
      client.on('gotFile', handleHostGotFile({ client, req, parties }))
      parties[req.name_lc] = {
        host: {
          client,
          key: req.socketKey
        },
        guests: {},
        state: req.state,
        name: req.name
      }
      resolve({ queryString: `?name=${req.name_lc}` })
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
