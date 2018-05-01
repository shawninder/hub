const log = require('./log')
const handleSlice = require('./handleSlice')
const handleHostDisconnect = require('./handleHostDisconnect')

module.exports = exports = function startParty ({ req, resolve, reject, client, parties }) {
  if (parties[req.name]) {
    reject("Can't start party, it already exists!")
  } else {
    if (req.socketKey) {
      client.on('slice', handleSlice({ client, parties }))
      client.on('disconnect', handleHostDisconnect({ client, req, parties }))
      parties[req.name] = {
        host: client,
        hostKey: req.socketKey,
        guests: [],
        state: req.state
      }
      resolve()
      log(`Started party ${req.name}`)
    } else {
      reject("Can't start party, no socketKey")
    }
  }
}
