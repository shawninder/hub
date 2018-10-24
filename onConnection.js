const log = require('./log')
const handleRequest = require('./handleRequest')
const handleSlice = require('./handleSlice')
const handleGetDetails = require('./handleGetDetails')

module.exports = exports = function onConnection ({ client, parties }) {
  log({
    name: 'Client connect',
    client: String(client.id)
  })
  client.on('request', handleRequest({ client, parties }))
  client.on('slice', handleSlice({ client, parties }))
  client.on('getDetails', /* auth, */ handleGetDetails({ client, parties }))
  client.on('*', () => {
    log({
      name: 'Unkwnown event',
      arguments
    })
  })
}
