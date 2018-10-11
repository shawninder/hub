const Data = require('data')
let username
let password
let cluster
let hosts
let databaseName
let replicaSet

if (process.env.NODE_ENV === 'production') {
  username = process.env.ATLAS_HUB_USERNAME
  password = process.env.ATLAS_HUB_PASSWORD
  cluster = process.env.ATLAS_CLUSTER
  hosts = process.env.ATLAS_HOSTS
  databaseName = process.env.ATLAS_DATABASE
  replicaSet = process.env.ATLAS_REPLICA_SET
} else {
  username = process.env.MONGO_HUB_USERNAME
  password = process.env.MONGO_HUB_PASSWORD
  cluster = process.env.MONGO_CLUSTER
  hosts = process.env.MONGO_HOSTS
  databaseName = process.env.MONGO_DATABASE
  replicaSet = process.env.MONGO_REPLICA_SET
}
const data = new Data({
  username,
  password,
  cluster,
  hosts,
  databaseName,
  replicaSet
})
module.exports = exports = (event) => {
  return data.use(({ db }) => {
    return db.collection('events').insertOne(event)
  })
}
