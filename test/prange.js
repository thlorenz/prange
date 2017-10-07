'use strict'

const test = require('tape')
const prange = require('../')

// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

test('\ndash notation', function(t) {
  let s = 'AA-TT, 22-55, 88'
  t.deepEqual(prange(s),
      [ 'AA', 'KK', 'QQ', 'JJ', 'TT', '88', '55', '44', '33', '22' ]
    , 'pairs only: ' + s
  )
  s = 'AKo-ATo, KQo-KJ'
  t.deepEqual(prange(s),
      [ 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo' ]
    , 'non-pairs offsuit: ' + s
  )
  s = 'AKs-AT, JTs-J8s, 54-53s'
  t.deepEqual(prange(s),
      [ 'AKs', 'AQs', 'AJs', 'ATs', 'JTs', 'J9s', 'J8s', '54s', '53s' ]
    , 'non-pairs suited: ' + s
  )
  s = 'AK-AT, KQ-KJ'
  t.deepEqual(prange(s),
      [ 'AKo', 'AKs', 'AQo', 'AQs', 'AJo', 'AJs', 'ATs', 'ATo', 'KQo', 'KQs', 'KJo', 'KJs' ]
    , 'non-pairs no suit given: ' + s
  )
  s = 'AK-JT, 97s-53s'
  t.deepEqual(prange(s),
      [ 'AKo', 'AKs', 'KQo', 'KQs', 'QJo', 'QJs', 'JTs', 'JTo',
        '97s', '86s', '75s', '64s', '53s' ]
    , 'connectors and gappers: ' + s
  )
  t.end()
})

test('\nplus notation', function(t) {
  let s = 'QQ+'
  t.deepEqual(prange(s),
      [ 'AA', 'KK', 'QQ' ]
    , s
  )
  s = '44+'
  t.deepEqual(prange(s),
      [ 'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44' ]
    , s
  )
  s = 'KK+, 77'
  t.deepEqual(prange(s),
      [ 'AA', 'KK', '77' ]
    , s
  )
  s = 'AT+, KQ+'
  t.deepEqual(prange(s),
      [ 'AKo', 'AKs', 'AQo', 'AQs', 'AJo', 'AJs', 'ATo', 'ATs', 'KQo', 'KQs' ]
    , s
  )

  s = 'A2s+, QTs+, AJo+'
  t.deepEqual(prange(s),
    [ 'AKo', 'AKs', 'AQo', 'AQs', 'AJo',
      'AJs', 'ATs', 'A9s', 'A8s', 'A7s',
      'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
      'QJs', 'QTs' ]
    , s
  )
  t.end()
})

test('\nsingle combos', function(t) {
  let s = 'AKo, AQs, AJ'
  t.deepEqual(prange(s), [ 'AKo', 'AQs', 'AJo', 'AJs' ], s)

  t.end()
})

test('\nseparation by spaces and error correction', function(t) {
  let s = 'AKo AQs AJ'
  t.deepEqual(prange(s), [ 'AKo', 'AQs', 'AJo', 'AJs' ], s)
  s = 'AKo  AQs AJ'
  t.deepEqual(prange(s), [ 'AKo', 'AQs', 'AJo', 'AJs' ], s)
  s = 'AKo  AQs     ,     AJ'
  t.deepEqual(prange(s), [ 'AKo', 'AQs', 'AJo', 'AJs' ], s)

  s = 'AKs - ATs AJ'
  t.deepEqual(prange(s), [ 'AKs', 'AQs', 'AJs', 'AJo', 'ATs' ], s)

  s = 'AKs - AQs, AJs    - ATs AJ'
  t.deepEqual(prange(s), [ 'AKs', 'AQs', 'AJs', 'AJo', 'ATs' ], s)

  s = 'AJs +  ,AT AJ'
  t.deepEqual(prange(s), [ 'AKs', 'AQs', 'AJs', 'AJo', 'ATo', 'ATs' ], s)
  t.end()
})
