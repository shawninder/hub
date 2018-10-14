const log = require('./log')
const isParty = require('./isParty')
const startParty = require('./startParty')
const joinParty = require('./joinParty')
const stopParty = require('./stopParty')
const leaveParty = require('./leaveParty')
const reconnect = require('./reconnect')

module.exports = exports = function handleRequest ({ client, parties }) {
  return (req) => {
    log({
      name: 'Request',
      reqName: req.reqName,
      from: req.socketKey,
      req
    })
    req.name_lc = req.name ? req.name.toLowerCase() : ''
    const resolve = (res) => {
      const obj = {
        req,
        res
      }
      log({
        name: 'Response',
        to: req.socketKey,
        req,
        response: obj
      })
      client.emit('response', obj)
    }
    const reject = (msg) => {
      log({
        name: 'Error response',
        to: req.socketKey,
        req,
        msg
      })
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
        reject({
          name: 'Unrecognized request',
          reqName: req.reqName,
          from: req.socketKey,
          req
        })
        break
    }
  }
}
