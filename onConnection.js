const log = require('./log')
const handleRequest = require('./handleRequest')
const handleSlice = require('./handleSlice')

module.exports = exports = function onConnection ({ client, parties }) {
  log('connection')
  client.on('request', handleRequest({ client, parties }))
  client.on('slice', handleSlice({ client, parties }))
  client.on('disconnect', () => {
    log('disconnection')
  })
  client.on('*', () => {
    log('Unkwnown event', arguments)
  })
}
