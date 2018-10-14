const Data = require('data')
const pkg = require('./package.json')
const env = process.env.NODE_ENV === 'production'
const config = {
  username: env ? process.env.ATLAS_HUB_USERNAME : process.env.MONGO_HUB_USERNAME,
  password: env ? process.env.ATLAS_HUB_PASSWORD : process.env.MONGO_HUB_PASSWORD,
  cluster: env ? process.env.ATLAS_CLUSTER : process.env.MONGO_CLUSTER,
  hosts: env ? process.env.ATLAS_HOSTS : process.env.MONGO_HOSTS,
  databaseName: env ? process.env.ATLAS_DATABASE : process.env.MONGO_DATABASE,
  replicaSet: env ? process.env.ATLAS_REPLICA_SET : process.env.MONGO_REPLICA_SET
}
const data = new Data(config)

module.exports = exports = async (event) => {
  try {
    await data.use(({ db }) => {
      return db.collection('events').insertOne({ origin: { name: pkg.name }, ...event })
    })
  } catch (ex) {
    if (process.env.NODE_ENV === 'production') {
      // ignore :(
    } else {
      console.log('Unable to log', ex, 'event:', event)
    }
  }
  // return data.use(({ db }) => {
  //   return db.collection('events').insertOne(event)
  // })
}
