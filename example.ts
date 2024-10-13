import { findBestMoveFromFen } from ".";

const bestMove = findBestMoveFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 4);
console.log(bestMove); // { E2: 'E4' } || { D2: 'D4' }.  This confrontation will be legendary :-) 