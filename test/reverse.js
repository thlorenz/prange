const test = require('tape')
const { reverse } = require('../')

test('\nreversing pairs', function(t) {
  [ [ [ 'AA', 'KK', 'QQ', 'JJ', 'TT', '88', '55', '44', '33', '22' ]
    , 'TT+, 88, 55-22' ]
  , [ [ 'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22' ]
    , '22+' ]
  , [ [ 'AA', 'KK', 'QQ', 'TT', '99', '77', '55', '44', '33' ]
    , 'QQ+, TT-99, 77, 55-33' ]
  , [ [ 'KK' ], 'KK' ]
  ].forEach(check)

  function check([ pairs, reversed ]) {
    const s = reverse(pairs)
    t.equal(s, reversed,
      `${pairs} reverses to ${reversed}`
    )
  }
  t.end()
})

test('\nnon pairs first rank same, increasing second rank', function(t) {
  [ [ [ 'AKo', 'AKs', 'AQo', 'AQs', 'AJo', 'AJs', 'ATo', 'ATs', 'KQo', 'KQs' ]
    , 'AT+, KQ' ]
  , [ [ 'AKo', 'AQo', 'AQs', 'AJo', 'AJs', 'ATo', 'ATs', 'KQo', 'KQs' ]
    , 'ATo+, KQ, AQs-ATs' ]
  , [ [ 'AKo', 'AKs', 'AQo', 'AQs', 'AJo', 'AJs', 'ATo', 'ATs', 'KQo', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s' ]
    , 'AT+, KQo, K8s+' ]
  ].forEach(check)

  function check([ nonpairs, reversed ]) {
    const s = reverse(nonpairs)
    t.equal(s, reversed,
      `${nonpairs} reverses to ${reversed}`
    )
  }
  t.end()
})

test('\nsuited connectors', function(t) {
  [ [ [ 'JTs', 'T9s', '98s', '87s', '76s', '65s', '54s' ]
    , 'JTs-54s' ]
  , [ [ 'JTs', 'T9s', '98s', '76s', '65s', '54s' ]
    , 'JTs-98s, 76s-54s' ]
  , [ [ 'JTs', 'J9s', 'J8s', 'JTo', 'J9o', 'J8o', 'T9s', '98s', '87s', '76s', '65s', '54s' ]
    , 'J8+, T9s-54s' ]
  , [ [ 'JTs', 'T9s', '98s', '87s' ], 'JTs-87s' ]
  , [ [ 'AKs', 'KQs', 'QJs' ], 'AKs-QJs' ]
  ].forEach(check)

  function check([ nonpairs, reversed ]) {
    const s = reverse(nonpairs)
    t.equal(s, reversed,
      `${nonpairs} reverses to ${reversed}`
    )
  }
  t.end()
})

test('\ngappers', function(t) {
  [ [ [ 'J9o', 'T8o', '97os', '86o' ]
    , 'J9o-86o' ]
  , [ [ 'JTo', 'J9o', 'J8o', 'T8o', '97os', '86o' ]
    , 'J8o+, T8o-86o' ]
  ].forEach(check)

  function check([ nonpairs, reversed ]) {
    const s = reverse(nonpairs)
    t.equal(s, reversed,
      `${nonpairs} reverses to ${reversed}`
    )
  }
  t.end()
})
