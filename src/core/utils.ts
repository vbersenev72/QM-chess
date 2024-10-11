import { COLUMNS, ROWS, COLORS, PIECES, piecesScore } from './const'

export function getPieceValue (piece: string) {
    const values: Record<string, number> = piecesScore
    return values[piece.toLowerCase()] || 0
}

export function getFEN (configuration: any) {
    let fen = ''
    Object.assign([], ROWS).reverse().map(row => {
        let emptyFields = 0
        if (row < 8) {
            fen += '/'
        }
        COLUMNS.map(column => {
            const piece = configuration.pieces[`${column}${row}`]
            if (piece) {
                if (emptyFields) {
                    fen += emptyFields.toString()
                    emptyFields = 0
                }
                fen += piece
            } else {
                emptyFields++
            }
        })
        fen += `${emptyFields || ''}`
    })

    fen += configuration.turn === COLORS.WHITE ? ' w ' : ' b '

    const { whiteShort, whiteLong, blackLong, blackShort } = configuration.castling
    if (!whiteLong && !whiteShort && !blackLong && !blackShort) {
        fen += '-'
    } else {
        if (whiteShort) fen += 'K'
        if (whiteLong) fen += 'Q'
        if (blackShort) fen += 'k'
        if (blackLong) fen += 'q'
    }

    fen += ` ${configuration.enPassant ? configuration.enPassant.toLowerCase() : '-'}`

    fen += ` ${configuration.halfMove}`

    fen += ` ${configuration.fullMove}`

    return fen
}

export function getJSONfromFEN (fen = '') {
    const [board, player, castlings, enPassant, halfmove, fullmove] = fen.split(' ')

    // pieces
    const configuration: any = {
        pieces: Object.fromEntries(board.split('/').flatMap((row, rowIdx) => {
            let colIdx = 0
            return row.split('').reduce((acc: any, sign) => {
                const piece = sign.match(/k|b|q|n|p|r/i)
                if (piece) {
                    acc.push([`${COLUMNS[colIdx]}${ROWS[7 - rowIdx]}`, piece[0]])
                    colIdx += 1
                }
                const squares = sign.match(/[1-8]/)
                if (squares) {
                    colIdx += Number(squares)
                }
                return acc
            }, [])
        })),
    }

    // playing player
    if (player === 'b') {
        configuration.turn = COLORS.BLACK
    } else {
        configuration.turn = COLORS.WHITE
    }

    // castlings
    configuration.castling = {
        whiteLong: false,
        whiteShort: false,
        blackLong: false,
        blackShort: false,
    }
    if (castlings.includes('K')) {
        configuration.castling.whiteShort = true
    }
    if (castlings.includes('k')) {
        configuration.castling.blackShort = true
    }
    if (castlings.includes('Q')) {
        configuration.castling.whiteLong = true
    }
    if (castlings.includes('q')) {
        configuration.castling.blackLong = true
    }

    // enPassant
    if (isLocationValid(enPassant)) {
        configuration.enPassant = enPassant.toUpperCase()
    }

    // halfmoves
    configuration.halfMove = parseInt(halfmove)

    // fullmoves
    configuration.fullMove = parseInt(fullmove)

    return configuration
}

export function isLocationValid (location: string) {
    return location.match('^[a-hA-H]{1}[1-8]{1}$')
}

export function isPieceValid (piece: string) {
    return Object.values(PIECES).includes(piece)
}