const log = require('./log')

module.exports = exports = function isParty ({ req, resolve, parties }) {
  log({
    name: 'Checking party existence',
    party: req.name
  })
  if (parties[req.name_lc]) {
    resolve({
      exists: true,
      name: req.name
    })
    log({
      name: 'Party exists',
      party: req.name
    })
  } else {
    resolve({
      exists: false,
      name: req.name
    })
    log({
      name: "Party doesn't exist",
      party: req.name
    })
  }
}
