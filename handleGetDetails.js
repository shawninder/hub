module.exports = exports = function handleGetDetails ({ client, parties }) {
  return () => {
    const partyNames = Object.keys(parties)
    const details = partyNames.map((name_lc) => { // eslint-disable-line camelcase
      const party = parties[name_lc]
      const guestKeys = Object.keys(party.guests)
      return { name_lc, hostKey: party.host.key, name: party.name, guestKeys, state: party.state }
    })
    client.emit('gotDetails', details)
  }
}
