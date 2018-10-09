const io = require('socket.io')()
const log = require('./log')
const onConnection = require('./onConnection')

const parties = {}
const port = 8000

io.on('connection', (client) => {
  return onConnection({ client, parties })
})
io.listen(port)

log({
  name: 'Server started',
  port
})
