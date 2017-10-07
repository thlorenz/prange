'use strict'

//
// None of the code here is elegant as I prefered to spell things out by hand
// instead of having to overheat my brain.
// If you find a more elegant solution, granted I can still follow it and it's
// not overly elegant, please submit a PR :)
//

function toHash(highRank, arr) {
  const hash = {}
  for (let i = 0; i < arr.length; i++) {
    hash[highRank + arr[i]] = i
  }
  hash._size = arr.length
  return hash
}

const connectors = {
    '32': 11
  , '43': 10
  , '54': 9
  , '65': 8
  , '76': 7
  , '87': 6
  , '98': 5
  , 'T9': 4
  , 'JT': 3
  , 'QJ': 2
  , 'KQ': 1
  , 'AK': 0
  , _size: 12
}

const gappers = {
    '42': 10
  , '53': 9
  , '64': 8
  , '75': 7
  , '86': 6
  , '97': 5
  , 'T8': 4
  , 'J9': 3
  , 'QT': 2
  , 'KJ': 1
  , 'AQ': 0
  , _size: 11
}

const ranks = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ].reverse()
const axArray = ranks.slice(1)
const kxArray = axArray.slice(1)
const qxArray = kxArray.slice(1)
const jxArray = qxArray.slice(1)
const txArray = jxArray.slice(1)
const _9xArray = txArray.slice(1)
const _8xArray = _9xArray.slice(1)

const ax = toHash('A', axArray)
const kx = toHash('K', kxArray)
const qx = toHash('Q', qxArray)
const jx = toHash('J', jxArray)
const tx = toHash('T', txArray)
const _9x = toHash('9', _9xArray)
const _8x = toHash('8', _8xArray)

// Detect connections in the following order:
// Ax+, Kx+, Qx+, Jx+, connectors, gappers, Tx+, 9x+, 8x+
// Only accept all groups that are at least 3 long
const orderedHashes = [ ax, kx, qx, jx, connectors, gappers, tx, _9x, _8x ]

function processCombos(hash, combos) {
  const slots = new Array(hash._size)
  const keys = Object.keys(hash)

  function updateSlot(k) {
    const idx = hash[k]
    const val = combos.has(k) ? k : null
    slots[idx] = val
  }
  keys.forEach(updateSlot)

  const groups = []
  let group = []
  for (let i = 0; i < slots.length; i++) {
    const val = slots[i]
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

function processGroups(groups, remainingCombos) {
  // don't allow smaller groups than 3
  const processedGroups = []
  for (let i = 0; i < groups.length; i++) {
    const combos = groups[i]
    if (combos.length < 3) continue
    processedGroups.push(combos)
    for (let j = 0; j < combos.length; j++) {
      remainingCombos.delete(combos[j])
    }
  }
  return processedGroups
}

function reverseNonPairs(combos, suffix) {
  function toShortNotation(hash, group) {
    const first = group[0]
    if (group.length === 1) return first
    const last = group[group.length - 1]
    if (hash[first] === 0 && hash !== connectors && hash !== gappers) {
      return last + suffix + '+'
    }
    return first + suffix + '-' + last + suffix
  }

  const remainingCombos = new Set(combos)
  let results = []
  for (let i = 0; i < orderedHashes.length; i++) {
    const hash = orderedHashes[i]
    const groups = processCombos(hash, remainingCombos)
    const processedGroups = processGroups(groups, remainingCombos)
    const notations = processedGroups.map(x => toShortNotation(hash, x))
    results = results.concat(notations)
  }
  return results.concat(Array.from(remainingCombos).map(x => x + suffix))
}

module.exports = reverseNonPairs
