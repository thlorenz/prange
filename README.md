# prange [![build status](https://secure.travis-ci.org/thlorenz/prange.png)](http://travis-ci.org/thlorenz/prange)

Parses poker hand range short notation into a range array.

```js
const prange = require('prange')

console.log(prange('AKs-ATs, QQ+'))
// [ 'AA', 'AKs', 'AQs', 'AJs', 'ATs', 'KK', 'QQ' ]

console.log(prange('JTs-54s'))
// [ 'JTs', 'T9s', '98s', '87s', '76s', '65s', '54s' ]
```

## Installation

    npm install prange

## [API](https://thlorenz.github.io/prange)


## License

MIT
