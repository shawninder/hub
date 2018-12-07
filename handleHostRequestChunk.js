const log = require('./log')

module.exports = exports = function handleHostRequestChunk ({ client, req, parties }) {
  return (action) => {
    const reject = (msg) => {
      const err = {
        msg,
        data: action
      }
      log({
        name: 'Handling request chunk failed',
        msg,
        action,
        host: req.socketKey
      })
      client.emit('err', err)
    }
    const party = parties[req.name_lc]
    log({
      name: 'Host requested chunk',
      client: String(client.id),
      party: req.name,
      host: req.socketKey,
      fileKey: req.fileKey
    })
    if (party) {
      const guest = party.guests[action.guestKey]
      if (guest) {
        guest.emit('requestChunk', action)
      } else {
        reject({
          name: "Can't find file owner guest to request chunk",
          party: req.name,
          action,
          host: req.socketKey
        })
      }
    }
  }
}
