import {
    AI_LEVELS,
    AI_DEPTH_BY_LEVEL,
    COLORS,
    NEW_GAME_BOARD_CONFIG,
    NEW_GAME_SETTINGS,
    down,
    downByColor,
    downLeft,
    downLeftByColor,
    downLeftDown,
    downLeftLeft,
    downRight,
    downRightByColor,
    downRightDown,
    downRightRight,
    left,
    right,
    scoreByPosition,
    up,
    upByColor,
    upLeft,
    upLeftByColor,
    upLeftLeft,
    upLeftUp,
    upRight,
    upRightByColor,
    upRightRight,
    upRightUp,
} from './const'

import { getPieceValue, getJSONfromFEN, isPieceValid, isLocationValid } from './utils'

const SCORE = {
    MIN: -1000,
    MAX: 1000,
}

const PIECE_VALUE_MULTIPLIER = 10

export default class Engine {
    private configuration: any

    constructor (configuration = JSON.parse(JSON.stringify(NEW_GAME_BOARD_CONFIG))) {
        if (typeof configuration === 'object') {
            this.configuration = Object.assign({}, NEW_GAME_SETTINGS, configuration)
        } else if (typeof configuration === 'string') {
            this.configuration = Object.assign({}, NEW_GAME_SETTINGS, getJSONfromFEN(configuration))
        } else {
            throw new Error(`Unknown configuration type.`)
        }
        if (!this.configuration.castling) {
            this.configuration.castling = {
                whiteShort: true,
                blackShort: true,
                whiteLong: true,
                blackLong: true,
            }
        }
    }

    getAttackingFields (color = this.getPlayingColor()) {
        let attackingFields: any[] = []
        for (const location in this.configuration.pieces) {
            const piece = this.getPiece(location)
            if (this.getPieceColor(piece) === color) {
                attackingFields = [...attackingFields, ...this.getPieceMoves(piece, location)]
            }
        }
        return attackingFields
    }

    isAttackingKing (color = this.getPlayingColor()) {
        let kingLocation = null
        for (const location in this.configuration.pieces) {
            const piece = this.getPiece(location)
            if (this.isKing(piece) && this.getPieceColor(piece) !== color) {
                kingLocation = location
                break
            }
        }

        return this.isPieceUnderAttack(kingLocation)
    }

    isPieceUnderAttack (pieceLocation: any) {
        const playerColor: any = this.getPieceOnLocationColor(pieceLocation)
        const enemyColor = this.getEnemyColor(playerColor)
        let isUnderAttack = false

        let field = pieceLocation
        let distance = 0
        while (up(field) && !isUnderAttack) {
            field = up(field)
            distance++
            const piece = this.getPiece(field)
            if (piece && this.getPieceColor(piece) === enemyColor &&
                (this.isRook(piece) || this.isQueen(piece) || (this.isKing(piece) && distance === 1))) {
                isUnderAttack = true
            }
            if (piece) break
        }

        field = pieceLocation
        distance = 0
        while (down(field) && !isUnderAttack) {
            field = down(field)
            distance++
            const piece = this.getPiece(field)
            if (piece && this.getPieceColor(piece) === enemyColor &&
                (this.isRook(piece) || this.isQueen(piece) || (this.isKing(piece) && distance === 1))) {
                isUnderAttack = true
            }
            if (piece) break
        }

        field = pieceLocation
        distance = 0
        while (left(field) && !isUnderAttack) {
            field = left(field)
            distance++
            const piece = this.getPiece(field)
            if (piece && this.getPieceColor(piece) === enemyColor &&
                (this.isRook(piece) || this.isQueen(piece) || (this.isKing(piece) && distance === 1))) {
                isUnderAttack = true
            }
            if (piece) break
        }

        field = pieceLocation
        distance = 0
        while (right(field) && !isUnderAttack) {
            field = right(field)
            distance++
            const piece = this.getPiece(field)
            if (piece && this.getPieceColor(piece) === enemyColor &&
                (this.isRook(piece) || this.isQueen(piece) || (this.isKing(piece) && distance === 1))) {
                isUnderAttack = true
            }
            if (piece) break
        }

        field = pieceLocation
        distance = 0
        while (upRightByColor(field, playerColor) && !isUnderAttack) {
            field = upRightByColor(field, playerColor)
            distance++
            const piece = this.getPiece(field)
            if (piece && this.getPieceColor(piece) === enemyColor &&
                (this.isBishop(piece) || this.isQueen(piece) || (distance === 1 && (this.isKing(piece) || this.isPawn(piece))))) {
                isUnderAttack = true
            }
            if (piece) break
        }

        field = pieceLocation
        distance = 0
        while (upLeftByColor(field, playerColor) && !isUnderAttack) {
            field = upLeftByColor(field, playerColor)
            distance++
            const piece = this.getPiece(field)
            if (piece && this.getPieceColor(piece) === enemyColor &&
                (this.isBishop(piece) || this.isQueen(piece) || (distance === 1 && (this.isKing(piece) || this.isPawn(piece))))) {
                isUnderAttack = true
            }
            if (piece) break
        }

        field = pieceLocation
        distance = 0
        while (downRightByColor(field, playerColor) && !isUnderAttack) {
            field = downRightByColor(field, playerColor)
            distance++
            const piece = this.getPiece(field)
            if (piece && this.getPieceColor(piece) === enemyColor &&
                (this.isBishop(piece) || this.isQueen(piece) || (this.isKing(piece) && distance === 1))) {
                isUnderAttack = true
            }
            if (piece) break
        }

        field = pieceLocation
        distance = 0
        while (downLeftByColor(field, playerColor) && !isUnderAttack) {
            field = downLeftByColor(field, playerColor)
            distance++
            const piece = this.getPiece(field)
            if (piece && this.getPieceColor(piece) === enemyColor &&
                (this.isBishop(piece) || this.isQueen(piece) || (this.isKing(piece) && distance === 1))) {
                isUnderAttack = true
            }
            if (piece) break
        }

        field = upRightUp(pieceLocation)
        let piece = this.getPiece(field)
        if (piece && this.getPieceColor(piece) === enemyColor && this.isKnight(piece)) {
            isUnderAttack = true
        }
        field = upRightRight(pieceLocation)
        piece = this.getPiece(field)
        if (piece && this.getPieceColor(piece) === enemyColor && this.isKnight(piece)) {
            isUnderAttack = true
        }
        field = upLeftLeft(pieceLocation)
        piece = this.getPiece(field)
        if (piece && this.getPieceColor(piece) === enemyColor && this.isKnight(piece)) {
            isUnderAttack = true
        }
        field = upLeftUp(pieceLocation)
        piece = this.getPiece(field)
        if (piece && this.getPieceColor(piece) === enemyColor && this.isKnight(piece)) {
            isUnderAttack = true
        }
        field = downLeftDown(pieceLocation)
        piece = this.getPiece(field)
        if (piece && this.getPieceColor(piece) === enemyColor && this.isKnight(piece)) {
            isUnderAttack = true
        }
        field = downLeftLeft(pieceLocation)
        piece = this.getPiece(field)
        if (piece && this.getPieceColor(piece) === enemyColor && this.isKnight(piece)) {
            isUnderAttack = true
        }
        field = downRightDown(pieceLocation)
        piece = this.getPiece(field)
        if (piece && this.getPieceColor(piece) === enemyColor && this.isKnight(piece)) {
            isUnderAttack = true
        }
        field = downRightRight(pieceLocation)
        piece = this.getPiece(field)
        if (piece && this.getPieceColor(piece) === enemyColor && this.isKnight(piece)) {
            isUnderAttack = true
        }

        return isUnderAttack
    }

    hasPlayingPlayerCheck () {
        return this.isAttackingKing(this.getNonPlayingColor())
    }

    hasNonPlayingPlayerCheck () {
        return this.isAttackingKing(this.getPlayingColor())
    }

    getMoves (color = this.getPlayingColor(), movablePiecesRequiredToSkipTest: any = null) {
        const allMoves: Record<string, string[]> = {} // Все возможные ходы
        let movablePiecesCount = 0
        for (const location in this.configuration.pieces) {
            const piece = this.getPiece(location)
            if (this.getPieceColor(piece) === color) {
                const moves = this.getPieceMoves(piece, location)
                if (moves.length) {
                    movablePiecesCount++
                }
                Object.assign(allMoves, { [location]: moves })
            }
        }

        const enemyAttackingFields = this.getAttackingFields(this.getNonPlayingColor())
        if (this.isLeftCastlingPossible(enemyAttackingFields)) {
            if (this.isPlayingWhite()) allMoves.E1.push('C1')
            if (this.isPlayingBlack()) allMoves.E8.push('C8')
        }
        if (this.isRightCastlingPossible(enemyAttackingFields)) {
            if (this.isPlayingWhite()) allMoves.E1.push('G1')
            if (this.isPlayingBlack()) allMoves.E8.push('G8')
        }

        if (movablePiecesRequiredToSkipTest && movablePiecesCount > movablePiecesRequiredToSkipTest) return allMoves

        const moves: Record<string, string[]> = {}
        for (const from in allMoves) {
            allMoves[from].map(to => {
                const testConfiguration = {
                    pieces: Object.assign({}, this.configuration.pieces),
                    castling: Object.assign({}, this.configuration.castling),
                }
                const testBoard = new Engine(testConfiguration)
                testBoard.move(from, to)
                if (
                    (this.isPlayingWhite() && !testBoard.isAttackingKing(COLORS.BLACK)) ||
                    (this.isPlayingBlack() && !testBoard.isAttackingKing(COLORS.WHITE))
                ) {
                    if (!moves[from]) {
                        moves[from] = []
                    }
                    moves[from].push(to)
                }
            })
        }

        if (!Object.keys(moves).length) {
            this.configuration.isFinished = true
            if (this.hasPlayingPlayerCheck()) {
                this.configuration.checkMate = true
            }
        }

        return moves
    }

    isLeftCastlingPossible (enemyAttackingFields: string[]) {
        if (this.isPlayingWhite() && !this.configuration.castling.whiteLong) return false
        if (this.isPlayingBlack() && !this.configuration.castling.blackLong) return false

        let kingLocation = null
        if (this.isPlayingWhite() && this.getPiece('E1') === 'K' && this.getPiece('A1') === 'R' && !enemyAttackingFields.includes('E1')) {
            kingLocation = 'E1'
        } else if (this.isPlayingBlack() && this.getPiece('E8') === 'k' && this.getPiece('A8') === 'r' && !enemyAttackingFields.includes('E8')) {
            kingLocation = 'E8'
        }
        if (!kingLocation) return false
        let field = left(kingLocation)
        if (this.getPiece(field) || enemyAttackingFields.includes(field)) return false
        field = left(field)
        if (this.getPiece(field) || enemyAttackingFields.includes(field)) return false
        field = left(field)
        if (this.getPiece(field)) return false

        return true
    }

    isRightCastlingPossible (enemyAttackingFields: string[]) {
        if (this.isPlayingWhite() && !this.configuration.castling.whiteShort) return false
        if (this.isPlayingBlack() && !this.configuration.castling.blackShort) return false

        let kingLocation = null
        if (this.isPlayingWhite() && this.getPiece('E1') === 'K' && this.getPiece('H1') === 'R' && !enemyAttackingFields.includes('E1')) {
            kingLocation = 'E1'
        } else if (this.isPlayingBlack() && this.getPiece('E8') === 'k' && this.getPiece('H8') === 'r' && !enemyAttackingFields.includes('E8')) {
            kingLocation = 'E8'
        }
        if (!kingLocation) return false

        let field = right(kingLocation)
        if (this.getPiece(field) || enemyAttackingFields.includes(field)) return false
        field = right(field)
        if (this.getPiece(field) || enemyAttackingFields.includes(field)) return false

        return true
    }

    getPieceMoves (piece: string, location: string) {
        if (this.isPawn(piece)) return this.getPawnMoves(piece, location)
        if (this.isKnight(piece)) return this.getKnightMoves(piece, location)
        if (this.isRook(piece)) return this.getRookMoves(piece, location)
        if (this.isBishop(piece)) return this.getBishopMoves(piece, location)
        if (this.isQueen(piece)) return this.getQueenMoves(piece, location)
        if (this.isKing(piece)) return this.getKingMoves(piece, location)
        return []
    }

    isPawn (piece: string) {
        return piece.toUpperCase() === 'P'
    }

    isKnight (piece: string) {
        return piece.toUpperCase() === 'N'
    }

    isRook (piece: string) {
        return piece.toUpperCase() === 'R'
    }

    isBishop (piece: string) {
        return piece.toUpperCase() === 'B'
    }

    isQueen (piece: string) {
        return piece.toUpperCase() === 'Q'
    }

    isKing (piece: string) {
        return piece.toUpperCase() === 'K'
    }

    getPawnMoves (piece: string, location: string) {
        const moves = []
        const color = this.getPieceColor(piece)
        let move = upByColor(location, color)

        if (move && !this.getPiece(move)) {
            moves.push(move)
            move = upByColor(move, color)
            if (isInStartLine(color, location) && move && !this.getPiece(move)) {
                moves.push(move)
            }
        }

        move = upLeftByColor(location, color)
        if (move && ((this.getPiece(move) && this.getPieceOnLocationColor(move) !== color) || (move === this.configuration.enPassant))) {
            moves.push(move)
        }

        move = upRightByColor(location, color)
        if (move && ((this.getPiece(move) && this.getPieceOnLocationColor(move) !== color) || (move === this.configuration.enPassant))) {
            moves.push(move)
        }

        function isInStartLine (color: string, location: string) {
            if (color === COLORS.WHITE && location[1] === '2') {
                return true
            }
            if (color === COLORS.BLACK && location[1] === '7') {
                return true
            }
            return false
        }

        return moves
    }

    getKnightMoves (piece: string, location: string) {
        const moves = []
        const color = this.getPieceColor(piece)

        let field = upRightUp(location)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = upRightRight(location)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = upLeftUp(location)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = upLeftLeft(location)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = downLeftLeft(location)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = downLeftDown(location)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = downRightRight(location)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = downRightDown(location)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        return moves
    }

    getRookMoves (piece: string, location: string) {
        const moves = []
        const color = this.getPieceColor(piece)

        let field = location
        while (up(field)) {
            field = up(field)
            const pieceOnFieldColor = this.getPieceOnLocationColor(field)
            if (this.getPieceOnLocationColor(field) !== color) {
                moves.push(field)
            }
            if (pieceOnFieldColor) break
        }

        field = location
        while (down(field)) {
            field = down(field)
            const pieceOnFieldColor = this.getPieceOnLocationColor(field)
            if (this.getPieceOnLocationColor(field) !== color) {
                moves.push(field)
            }
            if (pieceOnFieldColor) break
        }

        field = location
        while (right(field)) {
            field = right(field)
            const pieceOnFieldColor = this.getPieceOnLocationColor(field)
            if (this.getPieceOnLocationColor(field) !== color) {
                moves.push(field)
            }
            if (pieceOnFieldColor) break
        }

        field = location
        while (left(field)) {
            field = left(field)
            const pieceOnFieldColor = this.getPieceOnLocationColor(field)
            if (this.getPieceOnLocationColor(field) !== color) {
                moves.push(field)
            }
            if (pieceOnFieldColor) break
        }

        return moves
    }

    getBishopMoves (piece: string, location: string) {
        const moves = []
        const color = this.getPieceColor(piece)

        let field = location
        while (upLeft(field)) {
            field = upLeft(field)
            const pieceOnFieldColor = this.getPieceOnLocationColor(field)
            if (this.getPieceOnLocationColor(field) !== color) {
                moves.push(field)
            }
            if (pieceOnFieldColor) break
        }

        field = location
        while (upRight(field)) {
            field = upRight(field)
            const pieceOnFieldColor = this.getPieceOnLocationColor(field)
            if (this.getPieceOnLocationColor(field) !== color) {
                moves.push(field)
            }
            if (pieceOnFieldColor) break
        }

        field = location
        while (downLeft(field)) {
            field = downLeft(field)
            const pieceOnFieldColor = this.getPieceOnLocationColor(field)
            if (this.getPieceOnLocationColor(field) !== color) {
                moves.push(field)
            }
            if (pieceOnFieldColor) break
        }

        field = location
        while (downRight(field)) {
            field = downRight(field)
            const pieceOnFieldColor = this.getPieceOnLocationColor(field)
            if (this.getPieceOnLocationColor(field) !== color) {
                moves.push(field)
            }
            if (pieceOnFieldColor) break
        }

        return moves
    }

    getQueenMoves (piece: string, location: string) {
        const moves = [
            ...this.getRookMoves(piece, location),
            ...this.getBishopMoves(piece, location),
        ]
        return moves
    }

    getKingMoves (piece: string, location: string) {
        const moves = []
        const color = this.getPieceColor(piece)

        let field = location
        field = up(field)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = location
        field = right(field)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = location
        field = down(field)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = location
        field = left(field)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = location
        field = upLeft(field)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = location
        field = upRight(field)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = location
        field = downLeft(field)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        field = location
        field = downRight(field)
        if (field && this.getPieceOnLocationColor(field) !== color) {
            moves.push(field)
        }

        return moves
    }

    getPieceColor (piece: string) {
        if (piece.toUpperCase() === piece) return COLORS.WHITE
        return COLORS.BLACK
    }

    getPieceOnLocationColor (location: string) {
        const piece = this.getPiece(location)
        if (!piece) return null
        if (piece.toUpperCase() === piece) return COLORS.WHITE
        return COLORS.BLACK
    }

    getPiece (location: string) {
        return this.configuration.pieces[location]
    }

    setPiece (location: string, piece: string) {
        if (!isPieceValid(piece)) {
            throw new Error(`Invalid piece ${piece}`)
        }

        if (!isLocationValid(location)) {
            throw new Error(`Invalid location ${location}`)
        }

        this.configuration.pieces[location.toUpperCase()] = piece
    }

    removePiece (location: string) {
        if (!isLocationValid(location)) {
            throw new Error(`Invalid location ${location}`)
        }

        delete this.configuration.pieces[location.toUpperCase()]
    }

    isEmpty (location: string) {
        if (!isLocationValid(location)) {
            throw new Error(`Invalid location ${location}`)
        }

        return !this.configuration.pieces[location.toUpperCase()]
    }

    getEnemyColor (playerColor: string) {
        return playerColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE
    }

    getPlayingColor () {
        return this.configuration.turn
    }

    getNonPlayingColor () {
        return this.isPlayingWhite() ? COLORS.BLACK : COLORS.WHITE
    }

    isPlayingWhite () {
        return this.configuration.turn === COLORS.WHITE
    }

    isPlayingBlack () {
        return this.configuration.turn === COLORS.BLACK
    }

    move (from: string, to: string): void {
        // Move logic
        const chessmanFrom = this.getPiece(from)
        const chessmanTo = this.getPiece(to)

        if (!chessmanFrom) {
            throw new Error(`There is no piece at ${from}`)
        }

        Object.assign(this.configuration.pieces, { [to]: chessmanFrom })
        delete this.configuration.pieces[from]

        // pawn reaches an end of a chessboard
        if (this.isPlayingWhite() && this.isPawn(chessmanFrom) && to[1] === '8') {
            Object.assign(this.configuration.pieces, { [to]: 'Q' })
        }
        if (this.isPlayingBlack() && this.isPawn(chessmanFrom) && to[1] === '1') {
            Object.assign(this.configuration.pieces, { [to]: 'q' })
        }

        // En passant check
        if (this.isPawn(chessmanFrom) && to === this.configuration.enPassant) {
            delete this.configuration.pieces[downByColor(to, this.getPlayingColor())]
        }

        // pawn En passant special move history
        if (this.isPawn(chessmanFrom) && this.isPlayingWhite() && from[1] === '2' && to[1] === '4') {
            this.configuration.enPassant = `${from[0]}3`
        } else if (this.isPawn(chessmanFrom) && this.isPlayingBlack() && from[1] === '7' && to[1] === '5') {
            this.configuration.enPassant = `${from[0]}6`
        } else {
            this.configuration.enPassant = null
        }

        // Castling - disabling
        if (from === 'E1') {
            Object.assign(this.configuration.castling, { whiteLong: false, whiteShort: false })
        }
        if (from === 'E8') {
            Object.assign(this.configuration.castling, { blackLong: false, blackShort: false })
        }
        if (from === 'A1') {
            Object.assign(this.configuration.castling, { whiteLong: false })
        }
        if (from === 'H1') {
            Object.assign(this.configuration.castling, { whiteShort: false })
        }
        if (from === 'A8') {
            Object.assign(this.configuration.castling, { blackLong: false })
        }
        if (from === 'H8') {
            Object.assign(this.configuration.castling, { blackShort: false })
        }

        // Castling - rook is moving too
        if (this.isKing(chessmanFrom)) {
            if (from === 'E1' && to === 'C1') return this.move('A1', 'D1')
            if (from === 'E8' && to === 'C8') return this.move('A8', 'D8')
            if (from === 'E1' && to === 'G1') return this.move('H1', 'F1')
            if (from === 'E8' && to === 'G8') return this.move('H8', 'F8')
        }

        this.configuration.turn = this.isPlayingWhite() ? COLORS.BLACK : COLORS.WHITE

        if (this.isPlayingWhite()) {
            this.configuration.fullMove++
        }

        this.configuration.halfMove++
        if (chessmanTo || this.isPawn(chessmanFrom)) {
            this.configuration.halfMove = 0
        }
    }


    findBestMove (level: number) {
        const scores = this.findBestMoves(level)
        return scores[0]
    }

    findBestMoves (level: number) {
        if (!AI_LEVELS.includes(level)) {
            throw new Error(`Invalid level ${level}. You can choose ${AI_LEVELS.join(',')}`)
        }
        if (this.shouldIncreaseLevel()) {
            level++
        }
        const scoreTable: Record<string, string | number>[] = []
        const initialScore = this.calculateScore(this.getPlayingColor())
        const moves = this.getMoves()
        for (const from in moves) {
                moves[from].map(to => {
                    const testBoard = this.getTestBoard()
                    const wasScoreChanged = Boolean(testBoard.getPiece(to))
                    testBoard.move(from, to)
                    scoreTable.push({
                        from,
                        to,
                        score: testBoard.negamax(this.getPlayingColor(), level, wasScoreChanged, wasScoreChanged ? testBoard.calculateScore(this.getPlayingColor()) : initialScore, to).score +
                            testBoard.calculateScoreByPiecesLocation(this.getPlayingColor()) +
                            (Math.floor(Math.random() * (this.configuration.halfMove > 10 ? this.configuration.halfMove - 10 : 1) * 10) / 10),
                    })
                })
        }

        scoreTable.sort((previous, next) => {
            return previous.score < next.score ? 1 : previous.score > next.score ? -1 : 0
        })
        return scoreTable
    }

    shouldIncreaseLevel () {
        return this.getIngamePiecesValue() < 50
    }

    getIngamePiecesValue () {
        let scoreIndex = 0
        for (const location in this.configuration.pieces) {
            const piece = this.getPiece(location)
            scoreIndex += getPieceValue(piece)
        }
        return scoreIndex
    }

    getTestBoard () {
        const testConfiguration = {
            pieces: Object.assign({}, this.configuration.pieces),
            castling: Object.assign({}, this.configuration.castling),
            turn: this.configuration.turn,
            enPassant: this.configuration.enPassant,
        }
        return new Engine(testConfiguration)
    }

    negamax(playingPlayerColor: string, level: number, capture: boolean, initialScore: number, move: string, depth = 1, alpha = SCORE.MIN, beta = SCORE.MAX) {
        let nextMoves = null;
    
        // Получаем возможные ходы в зависимости от уровня и состояния игры
        if (depth < AI_DEPTH_BY_LEVEL.EXTENDED[level] && this.hasPlayingPlayerCheck()) {
            nextMoves = this.getMoves(this.getPlayingColor());
        } else if (depth < AI_DEPTH_BY_LEVEL.BASE[level] || (capture && depth < AI_DEPTH_BY_LEVEL.EXTENDED[level])) {
            nextMoves = this.getMoves(this.getPlayingColor(), 5);
        }
    
        // Проверка окончания игры
        if (this.configuration.isFinished) {
            return {
                score: this.calculateScore(playingPlayerColor) + (this.getPlayingColor() === playingPlayerColor ? depth : -depth),
                max: true,
            };
        }
    
        // Если нет доступных ходов
        if (!nextMoves) {
            if (initialScore !== null) return { score: initialScore, max: false };
            const score = this.calculateScore(playingPlayerColor);
            return {
                score,
                max: false,
            };
        }
    
        let bestScore = SCORE.MIN; // Начинаем с минимального значения
        let maxValueReached = false;
    
        for (const from in nextMoves) {
            if (maxValueReached) continue;
    
            nextMoves[from].forEach(to => {
                if (maxValueReached) return;
    
                const testBoard = this.getTestBoard();
                const wasScoreChanged = Boolean(testBoard.getPiece(to));
                testBoard.move(from, to);
                if (testBoard.hasNonPlayingPlayerCheck()) return;
    
                // Рекурсивный вызов negamax для следующего уровня
                const result = testBoard.negamax(playingPlayerColor, level, wasScoreChanged, wasScoreChanged ? testBoard.calculateScore(playingPlayerColor) : initialScore, to, depth + 1, -beta, -alpha);
    
                const score = -result.score; // Переворачиваем знак
    
                bestScore = Math.max(bestScore, score); // Обновляем лучшее значение
                alpha = Math.max(alpha, score); // Обновляем альфа
    
                // Альфа-бета отсечение
                if (alpha >= beta) {
                    maxValueReached = true; // Отсекаем дальнейшие ходы
                    return; // Выходим из текущего цикла
                }
            });
        }
    
        return { score: bestScore, max: false };
    }

    calculateScoreByPiecesLocation(player = this.getPlayingColor()) {
        const columnMapping: Record<string, string | number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7 };
        const scoreMultiplier = 0.5;
        let score = 0;
    
        // Бонусы за контроль центра (D4, D5, E4, E5)
        const centralPositions = ["D4", "D5", "E4", "E5"];
        const centerControlBonus = 1; // Бонус за контроль центра
    
        // Оценка развития фигур (например, ранние ходы пешками)
        const developmentBonus = 0.5;
    
        for (const location in this.configuration.pieces) {
            const piece = this.getPiece(location);
            const pieceColor = this.getPieceColor(piece);
    
            if (scoreByPosition[piece]) {
                const rowIndex = location[1] ? Number(location[1]) - 1 : -1;
                const columnIndex = columnMapping[location[0]];
                const scoreIndex = scoreByPosition[piece][rowIndex][columnIndex];
    
                // Основная оценка позиции
                const pieceScore = (pieceColor === player ? scoreIndex : -scoreIndex) * scoreMultiplier;
                score += pieceScore;
    
                // Бонус за контроль центра
                if (centralPositions.includes(location)) {
                    score += (pieceColor === player ? centerControlBonus : -centerControlBonus);
                }
    
                // Бонусы за развитие фигур (например, если фигуры находятся на второй/третьей линии)
                if (piece.type === 'P' && ((pieceColor === 'white' && location[1] > '2') || (pieceColor === 'black' && location[1] < '7'))) {
                    score += (pieceColor === player ? developmentBonus : -developmentBonus);
                } else if (piece.type !== 'P' && (location[1] > '2' && location[1] < '7')) {
                    score += (pieceColor === player ? developmentBonus : -developmentBonus);
                }
            }
        }
    
        return score;
    }

    calculateScore(playerColor = this.getPlayingColor()) {
        let scoreIndex = 0;
    
        // Проверка на мат
        if (this.configuration.checkMate) {
            return this.getPlayingColor() === playerColor ? SCORE.MIN : SCORE.MAX;
        }
    
        // Проверка на ничью
        if (this.configuration.isFinished) {
            return this.getPlayingColor() === playerColor ? SCORE.MAX : SCORE.MIN;
        }
    
        // Оценка значимости фигур и бонусы за контроль центра и безопасность короля
        for (const location in this.configuration.pieces) {
            const piece = this.getPiece(location);
            const pieceColor = this.getPieceColor(piece);
            
            // Оценка базовой стоимости фигуры
            const pieceValue = getPieceValue(piece) * PIECE_VALUE_MULTIPLIER;
            scoreIndex += pieceColor === playerColor ? pieceValue : -pieceValue;
    
            // Бонус за контроль центра
            const centralControlBonus = this.evaluateCentralControl(location, pieceColor);
            scoreIndex += centralControlBonus;
    
            // Оценка безопасности короля
            if (piece.type === 'K') {
                const kingSafetyScore = this.evaluateKingSafety(pieceColor);
                scoreIndex += kingSafetyScore;
            }
        }
    
        return scoreIndex;
    }
    
    // Вспомогательная функция для оценки контроля центра
    evaluateCentralControl(location: string, pieceColor: string) {
        const centralPositions = ["D4", "D5", "E4", "E5"];
        return centralPositions.includes(location) ? (pieceColor === this.getPlayingColor() ? 1 : -1) : 0;
    }
    
    // Вспомогательная функция для оценки безопасности короля
    evaluateKingSafety(playerColor: string) {
        const threats = this.getThreatsToKing();
        if (threats.length > 0) {
            return playerColor === this.getPlayingColor() ? -threats.length * 5 : threats.length * 5;
        }
        return playerColor === this.getPlayingColor() ? 10 : -10; // Бонус за безопасность
    }
    
    // Вспомогательная функция для получения угроз для короля
    getThreatsToKing() {
        const threats = [];
        // Логика для поиска угроз к королю
        for (const location in this.configuration.pieces) {
            const piece = this.getPiece(location);
            const pieceColor = this.getPieceColor(piece);
            
            if (pieceColor !== this.getPlayingColor() && this.getAttackingFields(this.getPlayingColor())) {
                threats.push(location); // Добавляем угрозу в список
            }
        }
        return threats;
    }
}