# Level creation

Level creation is done with the following steps:

1. Using LevelSettings, generate a random level
2. Verify if a generated level is beatable, by running it through a solver.

The solver is working as follows:

1. there are different tactics that evaluate the state, and provide a set of moves to apply.
2. of these moves, the top 3 best moves are picked.
3. each move is applied separately, and on its result another move is applied. The state with the best score wins that move.
4. all moves done are added to the level, so that the solve can be verified.

The initial implementation was slow (missed some penalties and bonuses, and did not have a look-ahead.) the algorithm was improved by pair-programming with ChatGPT:

https://chatgpt.com/share/66f2c336-8890-8004-afa1-0d7c51c08a1e
