const log = require('./log')
const handleSlice = require('./handleSlice')
const handleHostDisconnect = require('./handleHostDisconnect')
const handleGuestDispatch = require('./handleGuestDispatch')
const handleGuestDisconnect = require('./handleGuestDisconnect')

module.exports = exports = function reconnect ({ req, resolve, reject, client, parties }) {
  log(`Client "${req.socketKey}" reconnecting to "${req.name}"`, req)
  const party = parties[req.name]
  if (party) {
    if (req.hosting) {
      if (party.host.key === req.socketKey) {
        party.host.client = client
        client.on('slice', handleSlice({ client, parties }))
        client.on('disconnect', handleHostDisconnect({ client, req, parties }))
        if (req.state) {
          party.state = req.state
          resolve()
        } else {
          resolve({ state: party.state })
        }
        if (party.timer) {
          clearTimeout(party.timer)
        }
        log(`Host "${req.socketKey}" reconnected to "${req.name}", self-destruct canceled`)
      } else {
        reject("You're not the host of this party")
      }
    } else if (req.attending) {
      client.on('dispatch', handleGuestDispatch({ client, req, parties }))
      client.on('disconnect', handleGuestDisconnect({ client, req, parties }))
      party.guests[req.socketKey] = client
      resolve({ state: party.state })
      log(`Guest "${req.socketKey}" rejoined "${req.name}"`)
    } else {
      resolve({
        exists: true
      })
    }
  } else {
    reject("Party doesn't exist")
  }
}
