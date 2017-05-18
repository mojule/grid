'use strict'

const Grid = require( '../src' )

const data = [
  [ 'Name', 'Age', 'Member' ],
  [ 'Nik', 36, true ],
  [ 'Andy', 21, true ],
  [ 'Alex', 25, false ]
]

const grid = Grid( data )

console.log( 'columns' )
console.log( JSON.stringify( grid.columns() ) )
console.log( '---' )
