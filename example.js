'use strict'

const prange = require('./')

const r1 = prange('AKs-ATs, QQ+')
const r2 = prange('JTs-54s')

console.log(r1)
// [ 'AA', 'AKs', 'AQs', 'AJs', 'ATs', 'KK', 'QQ' ]

console.log(r2)
// [ 'JTs', 'T9s', '98s', '87s', '76s', '65s', '54s' ]

console.log(prange.reverse(r1))
// QQ+, ATs+

console.log(prange.reverse(r2))
// JTs-54s
