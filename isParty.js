const log = require('./log')

module.exports = exports = function isParty ({ req, resolve, parties }) {
  log(`Is "${req.name}" a valid party name?`)
  if (parties[req.name_lc]) {
    resolve({
      exists: true,
      name: req.name
    })
    log(`Is "${req.name}" a valid party name? YES`)
  } else {
    resolve({
      exists: false,
      name: req.name
    })
    log(`Is "${req.name}" a valid party name? NO`)
  }
}
