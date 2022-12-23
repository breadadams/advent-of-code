import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

console.time("part 1");

type Rotation = "R" | "L";

type Direction = number;

const OPEN_TILE = ".";
const WALL = "#";
const AIR = " ";

const [boardStr, pathStr] = puzzleInput.split("\n\n");

const boardRows = boardStr.split("\n");
const board = boardRows.map((row) => row.split(""));

const pathDirections = pathStr.split(/\d/).filter((s) => s);
const pathDistances = pathStr.split(/[RL\s]/).map((n) => parseInt(n));
const firstPathDistance = pathDistances.shift()!;

const firstPath = {
  distance: firstPathDistance,
  rotation: "R" as Rotation,
};

const paths = pathDistances.map((distance, i) => ({
  distance,
  rotation: pathDirections[i] as Rotation,
}));

paths.unshift(firstPath);

const boardRowOpenings = new Map<number, number>();
const getBoardRowOpening = (y: number) => {
  if (boardRowOpenings.has(y)) return boardRowOpenings.get(y)!;

  const opening = board[y].findIndex((tile) => tile !== AIR);
  boardRowOpenings.set(y, opening);

  return opening;
};

const boardColumnOpenings = new Map<number, number>();
const getBoardColumnOpening = (x: number) => {
  if (boardColumnOpenings.has(x)) return boardColumnOpenings.get(x)!;

  const opening = board.findIndex((row) => row[x] && row[x] !== AIR);
  boardColumnOpenings.set(x, opening);

  return opening;
};

const boardColumnEndings = new Map<number, number>();
const getBoardColumnEnding = (x: number) => {
  if (boardColumnEndings.has(x)) return boardColumnEndings.get(x)!;

  // @ts-ignore
  const ending = board.findLastIndex(
    (row: string[]) => row[x] && row[x] !== AIR
  ) as number;
  boardColumnEndings.set(x, ending);

  return ending;
};

/**
 * Directions:
 *
 * 0: right
 * 1: down
 * 2: left
 * 3: up
 */

const getNextDirection = (
  direction: Direction,
  rotation: Rotation
): Direction => {
  if (rotation === "L") return direction === 0 ? 3 : direction - 1;

  return direction === 3 ? 0 : direction + 1;
};

const getTile = (x: number, y: number) => board?.[y]?.[x];

const position = {
  x: getBoardRowOpening(0),
  y: 0,
  direction: 3 as Direction,
};

for (const path of paths) {
  const nextDirection = getNextDirection(position.direction, path.rotation);
  position.direction = nextDirection;

  for (let step = 0; step < path.distance; step++) {
    // Right & Left
    if (nextDirection === 0 || nextDirection === 2) {
      const isRight = nextDirection === 0;
      const nextX = isRight ? position.x + 1 : position.x - 1;
      const nextTile = getTile(nextX, position.y);

      if (nextTile === OPEN_TILE) {
        position.x = nextX;
      } else if (nextTile === WALL) {
        break;
      } else {
        const otherSideX = isRight
          ? getBoardRowOpening(position.y)
          : board[position.y].length - 1;

        const otherSidePosition = { ...position, x: otherSideX };
        const otherSideTile = getTile(otherSidePosition.x, otherSidePosition.y);

        if (otherSideTile === OPEN_TILE) {
          position.x = otherSidePosition.x;
        }

        if (otherSideTile === WALL) {
          break;
        }
      }
    }

    // Down & Up
    if (nextDirection === 1 || nextDirection === 3) {
      const isDown = nextDirection === 1;
      const nextY = isDown ? position.y + 1 : position.y - 1;
      const nextTile = getTile(position.x, nextY);

      if (nextTile === OPEN_TILE) {
        position.y = nextY;
      } else if (nextTile === WALL) {
        break;
      } else {
        const otherSidePosition = {
          ...position,
          y: isDown
            ? getBoardColumnOpening(position.x)
            : getBoardColumnEnding(position.x),
        };
        const otherSideTile = getTile(otherSidePosition.x, otherSidePosition.y);

        if (otherSideTile === OPEN_TILE) {
          position.y = otherSidePosition.y;
        }

        if (otherSideTile === WALL) {
          break;
        }
      }
    }
  }
}

const password =
  (position.y + 1) * 1000 + (position.x + 1) * 4 + position.direction;

console.log("part 1", password);
console.timeEnd("part 1");
