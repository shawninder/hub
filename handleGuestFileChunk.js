const log = require('./log')

module.exports = exports = function handleGuestFileChunk ({ client, req, parties }) {
  return (action) => {
    const reject = (msg) => {
      const err = {
        msg,
        data: action
      }
      log({
        name: 'Guest file chunk failed',
        msg,
        action,
        guest: req.socketKey
      })
      client.emit('err', err)
    }
    try {
      action.name_lc = action.name.toLowerCase()
      log({
        name: 'Guest sent file chunk',
        action,
        guest: req.socketKey
      })
      const party = parties[action.name_lc]
      if (party) {
        if (party.guests[req.socketKey]) {
          if (party.host.client && party.host.client.connected) {
            log({
              name: 'Forwarding file chunk to host',
              host: party.host.key,
              action
            })
            party.host.client.emit('file-transfer-chunk', { ...action, guestKey: req.socketKey })
          } else {
            reject({
              name: "Can't reach host",
              party: req.name,
              action,
              guest: req.socketKey
              // host: party.host
            })
          }
        } else {
          reject({
            name: "Can't forward file chunk, you're not attending!",
            party: req.name,
            guest: req.socketKey
          })
        }
      } else {
        reject({
          name: "Can't forward file chunk, party doesn't exist!",
          party: req.name,
          guest: req.socketKey
        })
      }
    } catch (ex) {
      log({
        name: 'Rejecting request',
        action,
        ex
      })
      reject({
        name: "Can't forward file chunk, invalid request",
        party: req.name,
        guest: req.socketKey
      })
    }
  }
}
