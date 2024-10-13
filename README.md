**Installation**
```bash
git clone https://github.com/vbersenev72/QM-chess.git && cd QM-chess
npm ci
```


**Example**
```ts
import { findBestMoveFromFen } from "path_to_QM";

const bestMove = findBestMoveFromFen("rnbqkb1r/pppppppp/8/8/4P3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 2);
console.log(bestMove); // { E2: 'E4' } || { D2: 'D4' }.  This confrontation will be legendary :-) 
```


## TODO
- refactoring calculateScore algorithm
- add multithreading
- FEN validation (using "zod")
- UNIT tests by mocha + sinon