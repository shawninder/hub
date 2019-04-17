const merge = require('lodash.merge')
const log = require('./log')

module.exports = exports = function handleSlice ({ client, parties }) {
  return (action) => {
    action.name_lc = action.name.toLowerCase()
    if (action.type !== 'Party:slice') {
      log({
        name: 'Host dispatch',
        from: action.socketKey,
        action
      })
    }
    const reject = (msg) => {
      const err = {
        msg,
        data: action
      }
      log({
        name: 'Host dispatch failed',
        action,
        err
      })
      client.emit('err', err)
    }
    const party = parties[action.name_lc]
    if (party) {
      if (party.host.key === action.socketKey) {
        const guestKeys = Object.keys(party.guests)
        party.state = merge(party.state, action.slice)
        guestKeys.forEach((guestKey) => {
          const guest = party.guests[guestKey]
          log({
            name: 'Emitting slice',
            to: guestKey,
            slice: action.slice
          })
          guest.emit('slice', action.slice)
        })
      } else {
        reject({ name: "Can't send state slice, you're not the host!" })
      }
    } else {
      reject({ name: "Can't send state slice, party doesn't exist!" })
    }
  }
}
