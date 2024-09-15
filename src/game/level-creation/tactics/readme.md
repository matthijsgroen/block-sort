# Tactics

Tactics are ways to 'look' at a level to spot a move.
The smarter the move is, the higher the weight applied to it, to increase the chance that the best move is picked.

In terms of weight, a 1 is considered a dumb move, and 100 an extremely smart move.

## Random move

This is the fall-back move (weight: 1). It just picks a random block,
and moves it to a random allowed position.

## Start new Column

Check if there are multiple of a kind, and a free column.
Pick that color to start a new column.

Check if there is an item on the second row that has also
one on the surface, and a free column.

Assign extra weight if that is the case
