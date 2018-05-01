const log = require('./log')

module.exports = exports = function isParty ({ req, resolve, parties }) {
  if (parties[req.name]) {
    resolve({
      exists: true,
      name: req.name
    })
    log(`${req.name} is a party`)
  } else {
    resolve({
      exists: false,
      name: req.name
    })
    log(`${req.name} isn't a party`)
  }
}
