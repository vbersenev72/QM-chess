export type Board = string[][]

export type Position = string

export interface MiniMaxAlphaBetaSlice {
    board: Board, 
    depth: number, 
    alpha: number, 
    beta: number, 
    maximizingPlayer: boolean
}