'use strict'

const { rankCodes } = require('./core')

function groupify(pairs) {
  const containedCodes = [ null, null, null, null,
                           null, null, null, null,
                           null, null, null, null, null ]

  for (const p of pairs) {
    const code = rankCodes[p[0]]
    containedCodes[code] = p
  }

  const reversed = containedCodes.reverse()
  const groups = []
  let group = []
  for (let i = 0; i < reversed.length; i++) {
    const val = reversed[i]
    if (val == null) {
      if (group.length) groups.push(group)
      group = []
      continue
    }
    group.push(val)
  }
  if (group.length) groups.push(group)
  return groups
}

function toShortNotation(group) {
  const first = group[0]
  if (group.length === 1) return first
  const last = group[group.length - 1]
  return group[0] === 'AA' ? last + '+' : first + '-' + last
}

module.exports = function reversePairs(pairs) {
  const groups = groupify(pairs)
  return groups.map(toShortNotation)
}
