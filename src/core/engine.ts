import { Board, Position, MiniMaxAlphaBetaSlice } from "./types";

export class Engine {
    constructor(position: string) {
        this.position = position;
        this.board = this.positionToBoard(position);
    }
    private position: Position
    private board: Board

    get getBoard() {
        return this.board
    }

    get getPosition() {
        return this.position
    }

    positionToBoard(position: Position) {
        const rows = position.split(" ")[0].split("/");
        const board = [];
        for (let row of rows) {
            const boardRow = [];
            for (let char of row) {
                if (char) {
                    boardRow.push(char); // Фигура
                } else {
                    for (let i = 0; i < parseInt(char); i++) {
                        boardRow.push("."); // Пустая клетка
                    }
                }
            }
            board.push(boardRow);
        }
        return board;
    }

    // Оценка позиции
    evaluateBoard(board: Board) {
        // Здесь должна быть логика оценки позиции
        return Math.random(); // Временная логика, возвращающая случайное значение
    }

    // Генерация всех возможных ходов
    generateMoves(board: Board) {
        // Логика генерации всех возможных ходов
        return []; // Возвращаем пустой массив для примера
    }

    // Минимакс с альфа-бета отсечением
    minimax({
        board, 
        depth, 
        alpha, 
        beta, 
        maximizingPlayer
    }: MiniMaxAlphaBetaSlice) {
        if (depth === 0) {
            return this.evaluateBoard(board);
        }

        const moves = this.generateMoves(board);

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let move of moves) {
                const newBoard = this.makeMove(board, move); // Применяем ход
                const evalPosition = this.minimax({
                    board: newBoard,
                    depth: depth - 1, 
                    alpha: alpha, 
                    beta: beta, 
                    maximizingPlayer: false
                });
                maxEval = Math.max(maxEval, evalPosition);
                alpha = Math.max(alpha, evalPosition);
                if (beta <= alpha) {
                    break; // Альфа-бета отсечение
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let move of moves) {
                const newBoard = this.makeMove(board, move); // Применяем ход
                const evalPosition = this.minimax({
                    board: newBoard,
                    depth: depth - 1, 
                    alpha: alpha, 
                    beta: beta, 
                    maximizingPlayer: true
                });
                minEval = Math.min(minEval, evalPosition);
                beta = Math.min(beta, evalPosition);
                if (beta <= alpha) {
                    break; // Альфа-бета отсечение
                }
            }
            return minEval;
        }
    }

    // Применение хода к доске
    makeMove(board: Board, move: string) {
        // Логика применения хода к доске
        return board; // Возвращаем изменённую доску
    }

    // Главная функция для поиска лучшего хода
    findBestMove() {
        const moves = this.generateMoves(this.board);
        let bestMove = null;
        let bestEval = -Infinity;

        for (let move of moves) {
            const newBoard = this.makeMove(this.board, move);
            const evalPosition = this.minimax({
                board: newBoard,
                depth: 8, 
                alpha: -Infinity, 
                beta: Infinity, 
                maximizingPlayer: false
            });
            if (evalPosition > bestEval) {
                bestEval = evalPosition;
                bestMove = move;
            }
        }

        return bestMove; // Возвращаем лучший ход
    }
}