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
      if (party.host === client) {
        party.state = action.slice
        log('party.state', party.state)
        log('action', action)
        party.guests.forEach((guest) => {
          guest.emit('slice', action.slice)
          log('emitted slice', action)
        })
        log(`State slice forwarded to ${party.guests.length} guests`, action)
      } else {
        reject("Can't send state slice, you're not the host!")
      }
    } else {
      reject("Can't send state slice, party doesn't exist!")
    }
  }
}
