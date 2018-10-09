const log = require('./log')

module.exports = exports = function handleGuestDispatch ({ client, req, parties }) {
  return (action) => {
    action.name_lc = action.name.toLowerCase()
    log({
      name: 'Guest dispatched an action',
      action,
      guest: req.socketKey
    })
    const reject = (msg) => {
      const err = {
        msg,
        data: action
      }
      log({
        name: 'Guest dispatch failed',
        msg,
        action,
        guest: req.socketKey
      })
      client.emit('err', err)
    }
    const party = parties[action.name_lc]
    if (party) {
      if (party.guests[req.socketKey]) {
        if (party.host.client && party.host.client.connected) {
          log({
            name: 'Forwarding dispatch to host',
            host: party.host.key,
            action
          })
          party.host.client.emit('dispatch', action)
        } else {
          reject("Can't reach host")
        }
      } else {
        reject("Can't dispatch guest action, you're not attending!")
      }
    } else {
      reject("Can't dispatch guest action, party doesn't exist!")
    }
  }
}
