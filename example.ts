import { findBestMoveFromFen } from ".";

const bestMove = findBestMoveFromFen("rnbqkb1r/pppppppp/8/8/4P3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 2);
console.log(bestMove); // { E2: 'E4' } || { D2: 'D4' }.  This confrontation will be legendary :-) 
