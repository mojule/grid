'use strict'

const is = require( '@mojule/is' )

const $isRows = rows => is.array( rows ) && rows.every( is.array )

const $columnIndexToName = index => {
  let name = ''

  while( index >= 0 ){
    name = String.fromCharCode( index % 26 + 65 ) + name
    index = ~~( index / 26 ) - 1
  }

  return name
}

const columnNamePattern = /[A-Z]+/

const $columnNameToIndex = name => {
  if( !columnNamePattern.test( name ) ){
    if( is.string( name ) )
      name = name.toUpperCase()

    if( !columnNamePattern.test( name ) )
      return
  }

  const { length } = name
  let index = 0

  for( let i = 0; i < length; i++ )
    index += Math.pow( 26, length - i - 1 ) * ( name.charCodeAt( i ) - 64 )

  return index - 1
}

const $getWidth = rows =>
  rows.reduce(
    ( max, row ) => row.length > max ? row.length : max,
    0
  )

const $getHeight = rows => rows.length

const defaultOptions = {
  hasColumnHeaders: true,
  hasRowHeaders: false,
  columnNames: null,
  rowNames: null
}

const statics = api => {
  const $getColumnFrom = ( rows, x = 0, startY = 0, endY = api.getHeight( rows ) - 1 ) => {
    const column = []

    for( let y = startY; y <= endY; y++ ){
      const row = rows[ y ]
      column.push( row[ x ] )
    }

    return column
  }

  const $getColumnsFrom = ( rows, startX = 0, endX = api.getWidth( rows ) - 1, startY = 0, endY = api.getHeight( rows ) - 1 ) => {
    const columns = []

    for( let x = startX; x <= endX; x++ ){
      columns.push( api.getColumnFrom( rows, x, startY, endY ) )
    }

    return columns
  }

  const $getRowFrom = ( rows, y = 0, startX = 0, endX = api.getWidth( rows ) - 1 ) => {
    return rows[ y ].slice( startX, endX + 1 )
  }

  const $getRowsFrom = ( rows, startY = 0, endY = api.getHeight( rows ) - 1, startX = 0, endX = api.getWidth( rows ) - 1 ) => {
    const result = []

    for( let y = startY; y <= endY; y++ ){
      result.push( api.getRowFrom( rows, y, startX, endX ) )
    }

    return result
  }

  const $createState = ( rows, options = {} ) => {
    options = Object.assign( {}, defaultOptions, options )

    const { hasColumnHeaders, hasRowHeaders, format } = options

    if( is.string( format ) ){
      const args = api.fromFormat( format, rows, options )

      delete args.options.format

      return api.createState( args.rows, args.options )
    }

    if( !$isRows( rows ) ){
      const format = api.formatFor( rows )

      if( is.undefined( format ) )
        throw new Error( 'Expected rows or a known format' )

      const args = api.fromFormat( format, rows, options )

      return api.createState( args.rows, args.options )
    }

    let { columnNames, rowNames } = options

    const x = hasRowHeaders ? 1 : 0
    const y = hasColumnHeaders ? 1 : 0
    const endY = api.getHeight( rows ) - 1

    if( hasColumnHeaders && is.null( columnNames ) )
      columnNames = api.getRowFrom( rows, 0, x )

    if( hasRowHeaders && is.null( rowNames ) )
      rowNames = api.getColumnFrom( rows, 0, y )

    rows = api.getRowsFrom( rows, y, endY, x )

    return { rows, columnNames, rowNames }
  }

  return {
    $columnIndexToName,
    $columnNameToIndex,
    $getWidth,
    $getHeight,
    $isRows,
    $getColumnFrom,
    $getColumnsFrom,
    $getRowFrom,
    $getRowsFrom,
    $createState
  }
}

module.exports = statics
