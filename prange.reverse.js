'use strict'

const reversePairs = require('./lib/reverse-pairs')
const reverseNonPairs = require('./lib/reverse-non-pairs')

function sortOut(combos) {
  const offsuit = new Set()
  const suited = new Set()
  const pairs = new Set()
  for (let i = 0; i < combos.length; i++) {
    const [ rank1, rank2, suit ] = combos[i].trim()
    const desc = rank1 + rank2
    if (rank1 === rank2) {
      pairs.add(desc)
      continue
    }
    if (suit == null || suit === 'o') {
      offsuit.add(desc)
      continue
    }
    if (suit === 's') {
      suited.add(desc)
      continue
    }
    throw new Error('Invalid suit "' + suit + '" of "' + combos[i] + '"!')
  }

  return { offsuit, suited, pairs }
}

function unsuitWhenPossible(os, su) {
  const consolidated = []
  for (const n of os) {
    const suitedVersion = n.replace(/o/g, 's')
    if (su.has(suitedVersion)) {
      consolidated.push(n.replace(/o/g, ''))
      su.delete(suitedVersion)
    } else {
      consolidated.push(n)
    }
  }
  return consolidated.concat(Array.from(su))
}

/**
 * Converts a poker hand range to short notation.
 * It's the opposite of `prange`.
 *
 * @name prange.reverse
 * @function
 * @param {Array.<String>} combos hand combos to be converted to short notation
 * @param {String} the short notation for the range
 */
function reverse(combos) {
  const { offsuit, suited, pairs } = sortOut(combos)

  const ps = reversePairs(pairs)
  const os = reverseNonPairs(offsuit, 'o')
  const su = reverseNonPairs(suited, 's')
  const nonpairs = unsuitWhenPossible(new Set(os), new Set(su))

  return ps.concat(nonpairs).join(', ')
}

module.exports = reverse
module.exports.sortOut = sortOut
