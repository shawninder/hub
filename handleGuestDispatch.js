const log = require('./log')

module.exports = exports = function handleGuestDispatch ({ client, req, parties }) {
  return (action) => {
    log('GUEST DISPATCH', action)
    const reject = (msg) => {
      const err = {
        msg,
        data: action
      }
      client.emit('err', err)
      log('rejecting', err)
    }
    const party = parties[action.name]
    if (party) {
      if (party.guests[req.socketKey]) {
        // TODO search for "emit" and guard thusly?
        if (party.host.client && party.host.client.connected) {
          log('dispatching to host', action)
          party.host.client.emit('dispatch', action)
          log('dispatched', action)
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
