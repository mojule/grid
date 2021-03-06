'use strict'

const Grid = require( '../src' )
const log = require( './log' )

const data = [
  [ 'Name', 'Age', 'Member' ],
  [ 'Nik', 36, true ],
  [ 'Andy', 21, true ],
  [ 'Alex', 25, false ]
]

const state = Grid.createState( data )

log(
  'createState',
  'columnNames', state.columnNames,
  'rows', state.rows
)
