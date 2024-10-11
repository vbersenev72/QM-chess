import Engine from './src/core/engine'

export function findBestMoveFromFen (config: string | object, level = 2) {
    if (!config) {
        throw new Error('Configuration param required.')
    }
    const engine = new Engine(config)
    const move = engine.findBestMove(level)

    return move
}
