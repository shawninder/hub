const log = require('./log')

module.exports = exports = function handleSlice ({ client, parties }) {
  return (action) => {
    log('HOST DISPATCH', action)
    const reject = (msg) => {
      const err = {
        msg,
        data: action
      }
      log('rejecting', err)
      client.emit('err', err)
    }
    const party = parties[action.name]
    if (party) {
      const guestKeys = Object.keys(party.guests)
      if (party.host.client === client) {
        log('client match, host confirmed')
        party.state = action.slice
        log('party.state', party.state)
        log('action', action)
        guestKeys.forEach((guestKey) => {
          const guest = party.guests[guestKey]
          guest.emit('slice', action.slice)
          log('emitted slice', action)
        })
        log(`State slice forwarded to ${guestKeys.length} guests`, action)
      } else if (party.host.socketKey === action.socketKey) {
        log('socketKey match, host confirmed')
        party.state = action.slice
        log('party.state', party.state)
        log('action', action)
        guestKeys.forEach((guestKey) => {
          const guest = party.guests[guestKey]
          guest.emit('slice', action.slice)
          log('emitted slice', action)
        })
        log(`State slice forwarded to ${guestKeys.length} guests`, action)
      } else {
        reject("Can't send state slice, you're not the host!")
      }
    } else {
      reject("Can't send state slice, party doesn't exist!")
    }
  }
}
