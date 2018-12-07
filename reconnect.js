const log = require('./log')
const handleSlice = require('./handleSlice')
const handleHostDisconnect = require('./handleHostDisconnect')
const handleGuestDispatch = require('./handleGuestDispatch')
const handleGuestDisconnect = require('./handleGuestDisconnect')
const handleGuestFileChunk = require('./handleGuestFileChunk')
const handleHostRequestChunk = require('./handleHostRequestChunk')
const handleHostGotFile = require('./handleHostGotFile')

module.exports = exports = function reconnect ({ req, resolve, reject, client, parties }) {
  log({
    name: 'Client reconnecting',
    client: req.socketKey,
    party: req.name,
    req
  })
  const party = parties[req.name_lc]
  if (party) {
    if (req.hosting) {
      if (party.host.key === req.socketKey) {
        party.host.client = client
        client.removeAllListeners('slice')
        client.on('slice', handleSlice({ client, parties }))
        client.removeAllListeners('disconnect')
        client.on('disconnect', handleHostDisconnect({ client, req, parties }))
        client.removeAllListeners('requestChunk')
        client.on('requestChunk', handleHostRequestChunk({ client, req, parties }))
        client.removeAllListeners('gotFile')
        client.on('gotFile', handleHostGotFile({ client, req, parties }))
        if (req.state) {
          party.state = req.state
          resolve()
        } else {
          resolve({ state: party.state })
        }
        if (party.timer) {
          clearTimeout(party.timer)
          log({
            name: 'Host reconnected, self-destruct canceled',
            host: req.socketKey,
            party: req.name
          })
        }
        log({
          name: 'Host reconnected',
          host: req.socketKey,
          party: req.name
        })
      } else {
        reject({ name: "You're not the host of this party" })
      }
    } else if (req.attending) {
      client.removeAllListeners('dispatch')
      client.on('dispatch', handleGuestDispatch({ client, req, parties }))
      client.removeAllListeners('file-transfer-chunk')
      client.on('file-transfer-chunk', handleGuestFileChunk({ client, req, parties }))
      client.removeAllListeners('disconnect')
      client.on('disconnect', handleGuestDisconnect({ client, req, parties }))
      party.guests[req.socketKey] = client
      resolve({ state: party.state })
      log({
        name: 'Guest rejoined',
        guest: req.socketKey,
        party: req.name
      })
    } else {
      resolve({
        exists: true
      })
    }
  } else {
    reject({ name: "Party doesn't exist" })
  }
}
