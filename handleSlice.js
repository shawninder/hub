const log = require('./log')

module.exports = exports = function handleSlice ({ client, parties }) {
  return (action) => {
    action.name_lc = action.name.toLowerCase()
    log(`Host "${action.socketKey}" dispatched`, action)
    const reject = (msg) => {
      const err = {
        msg,
        data: action
      }
      log(`Emitting 'err' to host "${action.socketKey}" for dispatching action`, action, '\nerr', err)
      client.emit('err', err)
    }
    const party = parties[action.name_lc]
    if (party) {
      const guestKeys = Object.keys(party.guests)
      if (party.host.key === action.socketKey) {
        party.state = action.slice
        guestKeys.forEach((guestKey) => {
          const guest = party.guests[guestKey]
          log(`Emitting 'slice' to guest "${guestKey}"`, action.slice)
          guest.emit('slice', action.slice)
        })
        log(`reached "${guestKeys.length}" guests`)
      } else {
        reject("Can't send state slice, you're not the host!")
      }
    } else {
      reject("Can't send state slice, party doesn't exist!")
    }
  }
}
