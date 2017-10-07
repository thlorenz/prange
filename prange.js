'use strict'

const { codeRanks, rankCodes, byCodeRankDescending } = require('./lib/core')

const dashRangeRx = /[A,K,Q,J,T,2-9]{2}[o,s]?-[A,K,Q,J,T,2-9]{2}[o,s]?$/
const plusRangeRx = /[A,K,Q,J,T,2-9]{2}[o,s]?\+$/
const oneComboRx = /[A,K,Q,J,T,2-9]{2}[o,s]?$/

function minToMaxPairs(a, b) {
  const codea = rankCodes[a]
  const codeb = rankCodes[b]
  const min = Math.min(codea, codeb)
  const max = Math.max(codea, codeb)
  const arr = []
  for (let i = min; i <= max; i++) {
    const rank = codeRanks[i]
    arr.push(rank + rank)
  }
  return arr
}

function minToMaxNonPairs([ a1, a2, suita ], [ b1, b2, suitb ]) {
  let bothSuits = suita == null && suitb == null
  if (!bothSuits) {
    if (suita == null) suita = suitb
    if (suitb == null) suitb = suita
    if (suita !== suitb) {
      throw new Error(`${a1}${a2}${suita}-${b1}${b2}${suitb} have different suits`)
    }
  }

  const codea = rankCodes[a2]
  const codeb = rankCodes[b2]
  const min = Math.min(codea, codeb)
  const max = Math.max(codea, codeb)
  const arr = []
  for (let i = min; i <= max; i++) {
    const rank = codeRanks[i]
    if (bothSuits) {
      arr.push(a1 + rank + 'o')
      arr.push(a1 + rank + 's')
    } else {
      arr.push(a1 + rank + suita)
    }
  }
  return arr
}

function minToMaxConnectorsOrGappers([ a1, a2, suita ], [ b1, b2, suitb ]) {
  let bothSuits = suita == null && suitb == null
  if (!bothSuits) {
    if (suita == null) suita = suitb
    if (suitb == null) suitb = suita
    if (suita !== suitb) {
      throw new Error(`${a1}${a2}${suita}-${b1}${b2}${suitb} have different suits`)
    }
  }

  const codea1 = rankCodes[a1]
  const codea2 = rankCodes[a2]
  const codeb1 = rankCodes[b1]
  const codeb2 = rankCodes[b2]
  const min1 = Math.min(codea1, codeb1)
  const max1 = Math.max(codea1, codeb1)
  const min2 = Math.min(codea2, codeb2)
  const max2 = Math.max(codea2, codeb2)
  const delta1 = max1 - min1
  const delta2 = max2 - min2

  if (delta1 !== delta2) {
    throw new Error(
      `Connectors/Gappers ${a1}${a2}${suita}-${b1}${b2}${suitb} have unequal distance`
    )
  }

  const arr = []
  for (let i = min1, j = min2; i <= max1 && j <= max2; i++, j++) {
    const rank1 = codeRanks[i]
    const rank2 = codeRanks[j]
    if (bothSuits) {
      arr.push(rank1 + rank2 + 'o')
      arr.push(rank1 + rank2 + 's')
    } else {
      arr.push(rank1 + rank2 + suita)
    }
  }
  return arr
}

function singleCard([ a1, a2, suit ]) {
  if (suit == null) {
    return [ `${a1}${a2}o`, `${a1}${a2}s` ]
  } else {
    return [ `${a1}${a2}${suit}` ]
  }
}

function minToMax(a, b) {
  if (a === b) return singleCard(a)
  if (a[0] === a[1] && b[0] === b[1]) return minToMaxPairs(a[0], b[0])
  if (a[0] === b[0] && a[1] !== b[1]) return minToMaxNonPairs(a, b)
  return minToMaxConnectorsOrGappers(a, b)
}

function plus([ a, b, suit ]) {
  if (a === b) return minToMaxPairs(a, 'A')

  // K9+ gets filled as K9-KQ, i.e. the `9` part is filled up to `Q`
  // There is no way to treat things like JT+ as meaning AK-JT since in that
  // case J9+ is ambiguous, i.e. is it AQ-J9 or JT-J9?
  // Therefore we always assume the + only applies to the second rank.
  const codea = rankCodes[a]
  const codeb = rankCodes[b]
  const max = Math.max(codea, codeb)
  const min = Math.min(codea, codeb)
  const suitString = suit == null ? '' : suit

  const maxHand = codeRanks[max] + codeRanks[max - 1] + suitString
  const minHand = codeRanks[max] + codeRanks[min] + suitString
  return minToMax(minHand, maxHand)
}

function subrange(s) {
  if (dashRangeRx.test(s)) {
    const parts = s.split(/-/).map(x => x.trim())
    return minToMax(parts[0], parts[1])
  }
  if (plusRangeRx.test(s)) {
    return plus(s.replace(/\+/, ''))
  }
  if (oneComboRx.test(s)) {
    const [ r1, r2, suit ] = s.trim()
    if (r1 === r2 || suit != null) return [ s ]
    return [ s + 'o', s + 's' ]
  }

  throw new Error(`Invalid range/combo specifier ${s}`)
}

/**
 * Converts a short notation for poker hand ranges into an array
 * filled with the matching combos.
 *
 * Each range specifier is separated by a comma.
 *
 * The following notations are supported:
 *
 * - single combos `KK, AK, ATs`
 * - plus notation
 *    - `QQ+` = `[ AA, KK, QQ ]`
 *    - `KTs+` = `[ KQs, KJs, KTs ]`
 *    - `KTo+` = `[ KQo, KJo, KTo ]`
 *    - `KT+` = `[ KQs, KQo, KJo, KJs, KTo, KTs ]`
 * - dash notation
 *    - `KK-JJ` = `[ KK, QQ, JJ ]`
 *    - `AKo-ATo` = `[ AK, AQ, AJ, AT ]`
 *    - `AKs-JTs` = `[ AKs, KQs, JTs ]`
 *
 * @name prange
 * @function
 * @param {String} s the short notation for the range
 * @return {Array.<String>} all hand combos satisfying the given range
 */
function prange(s) {
  const set = new Set()
  const subs = s
     // correct things like AJs -A9s to AJs-A9s
    .replace(
      /([A,K,Q,J,T,2-9]{2}[o,s]?)\s*-\s*([A,K,Q,J,T,2-9]{2}[o,s]?)/g
      , '$1-$2'
    )
    // correct AK + to AK+
    .replace(
      /([A,K,Q,J,T,2-9]{2}[o,s]?)\s\+/g
      , '$1+'
    )
    // split at any white space or comma (any errornous space was removed via replace)
    .split(/[,\s]+/).map(x => x.trim())
  for (let i = 0; i < subs.length; i++) {
    const res = subrange(subs[i])
    res.forEach(x => set.add(x))
  }
  return Array.from(set).sort(byCodeRankDescending)
}

module.exports = prange
module.exports.reverse = require('./prange.reverse')
module.exports.categorize = module.exports.reverse.sortOut
