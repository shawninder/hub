const log = require('./log')

module.exports = exports = function handleGuestDispatch ({ client, req, parties }) {
  return (action) => {
    log(`Guest "${req.socketKey}" dispatched`, action)
    const reject = (msg) => {
      const err = {
        msg,
        data: action
      }
      log(`Emitting 'err' to guest "${req.socketKey}" for dispatching action`, action, '\nerr', err)
      client.emit('err', err)
    }
    const party = parties[action.name]
    if (party) {
      if (party.guests[req.socketKey]) {
        if (party.host.client && party.host.client.connected) {
          log(`Emitting 'dispatch' to host "${party.host.key}", action:`, action)
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
