const log = require('./log')
const isParty = require('./isParty')
const startParty = require('./startParty')
const joinParty = require('./joinParty')
const stopParty = require('./stopParty')
const leaveParty = require('./leaveParty')
const reconnect = require('./reconnect')

module.exports = exports = function handleRequest ({ client, parties }) {
  return (req) => {
    log('REQUEST', req.reqName)
    const resolve = (res) => {
      const obj = {
        req,
        res
      }
      client.emit('response', obj)
      log('RESPONSE', obj)
    }
    const reject = (msg) => {
      log('rejecting', msg)
      client.emit('response', {
        req,
        err: msg
      })
    }
    switch (req.reqName) {
      case 'isParty':
        isParty({ req, resolve, parties })
        break
      case 'startParty':
        startParty({ req, resolve, reject, client, parties })
        break
      case 'joinParty':
        joinParty({ req, resolve, reject, client, parties })
        break
      case 'stopParty':
        stopParty({ req, resolve, reject, parties })
        break
      case 'leaveParty':
        leaveParty({ req, resolve, reject, client, parties })
        break
      case 'reconnect':
        reconnect({ req, resolve, reject, client, parties })
        break
      default:
        log('Unrecognized request', req.reqName)
        reject('Unrecognized request')
        break
    }
  }
}
