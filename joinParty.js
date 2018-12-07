const log = require('./log')
const handleGuestDispatch = require('./handleGuestDispatch')
const handleGuestDisconnect = require('./handleGuestDisconnect')
const handleGuestFileChunk = require('./handleGuestFileChunk')

module.exports = exports = function joinParty ({ req, resolve, reject, client, parties }) {
  log({
    name: 'Guest wants to join',
    guest: req.socketKey,
    party: req.name
  })
  const party = parties[req.name_lc]
  if (party) {
    if (party.guests[req.socketKey]) {
      reject({ name: "Can't join party, you're already attending" })
    } else {
      if (req.socketKey) {
        client.on('dispatch', handleGuestDispatch({ client, req, parties }))
        client.on('disconnect', handleGuestDisconnect({ client, req, parties }))
        client.on('file-transfer-chunk', handleGuestFileChunk({ client, req, parties }))
        party.guests[req.socketKey] = client
        resolve({
          state: party.state,
          name: party.name
        })
        log({
          name: 'Guest joined',
          guest: req.socketKey,
          party: req.name
        })
      } else {
        reject({ name: "Can't join party, missing `socketKey`" })
      }
    }
  } else {
    reject({ name: "Can't join party, it doesn't exist!" })
  }
}
