const data = require('data')
let username
let password
let hosts
let databaseName
let replicaSet
if (process.env.NODE_ENV === 'production') {
  username = process.env.ATLAS_HUB_USERNAME
  password = process.env.ATLAS_HUB_PASSWORD
  hosts = process.env.ATLAS_HOSTS
  databaseName = process.env.ATLAS_DATABASE
  replicaSet = process.env.ATLAS_REPLICA_SET
} else {
  username = process.env.MONGO_HUB_USERNAME
  password = process.env.MONGO_HUB_PASSWORD
  hosts = process.env.MONGO_HOSTS
  databaseName = process.env.MONGO_DATABASE
  replicaSet = process.env.MONGO_REPLICA_SET
}
const database = data({
  username,
  password,
  hosts,
  databaseName,
  replicaSet
})
module.exports = exports = (event) => {
  return database.use((db) => {
    return db.collection('events').insert(event)
  })
}
