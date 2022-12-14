import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

type Coordinate = [number, number];
type Path = Coordinate[];

const ROCK = "#";
const AIR = ".";
const REST = "o";

type Rock = typeof ROCK;
type Air = typeof AIR;
type Rest = typeof REST;

const rockPaths = puzzleInput
  .split("\n")
  .map(
    (line) =>
      line
        .split(" -> ")
        .map((coordinateStr) =>
          coordinateStr.split(",").map((coordinate) => parseInt(coordinate))
        ) as Path
  );

const largestX = Math.max(
  ...rockPaths.map((path) => Math.max(...path.map(([x]) => x)))
);
const smallestX = Math.min(
  ...rockPaths.map((path) => Math.min(...path.map(([x]) => x)))
);

const largestY = Math.max(
  ...rockPaths.map((path) => Math.max(...path.map(([, y]) => y)))
);

const caveWidth = largestX - smallestX + 1;
const caveHeight = largestY + 1;

type Cave = Array<Array<Air | Rest | Rock>>;

const getCave = () => {
  const cave: Cave = [...Array(caveHeight).keys()].map(() =>
    [...Array(caveWidth).keys()].map(() => AIR)
  );

  for (const path of rockPaths) {
    for (const [i, coordinate] of path.entries()) {
      if (i < path.length - 1) {
        const x = coordinate[0] - smallestX;
        const y = coordinate[1];

        cave[y][x] = ROCK;

        const nextPath = path[i + 1];
        const nextX = nextPath[0] - smallestX;
        const nextY = nextPath[1];

        const distanceX = Math.abs(nextX - x);
        const distanceY = Math.abs(nextY - y);

        if (distanceX > 0) {
          // Moving left or right
          const isMovingRight = nextX > x;

          for (let j = 1; j <= distanceX; j++) {
            const rockX = isMovingRight ? x + j : x - j;
            cave[y][rockX] = ROCK;
          }
        } else if (distanceY > 0) {
          // Moving up or down
          const isMovingDown = nextY > y;

          for (let j = 1; j <= distanceY; j++) {
            const rockY = isMovingDown ? y + j : y - j;
            cave[rockY][x] = ROCK;
          }
        }
      }
    }
  }

  return cave;
};

const printCave = (cave: Cave, sandPosition?: Coordinate) => {
  cave.forEach((row, y) =>
    console.log(
      row
        .map((cell, x) =>
          x === sandPosition?.[0] && y === sandPosition?.[1] ? "+" : cell
        )
        .join("")
    )
  );
};

const getCaveCell = (cave: Cave, cell: Coordinate) => cave[cell[1]][cell[0]];

// Part 1
(() => {
  const cave = getCave();
  const sandEntrance: Coordinate = [500 - smallestX, 0];
  let overflown = false;
  let sandCount = 0;
  let currentSandPosition: Coordinate = [...sandEntrance];

  while (!overflown) {
    const x = currentSandPosition[0];
    const y = currentSandPosition[1];

    // printCave(cave, currentSandPosition);

    const down: Coordinate = [x, y + 1];
    const leftDown: Coordinate = [x - 1, y + 1];
    const rightDown: Coordinate = [x + 1, y + 1];

    if (leftDown[0] < 0 || rightDown[0] > caveWidth - 1) {
      // If leftDown|rightDown goes outside the cave, STOP
      overflown = true;
    } else if (getCaveCell(cave, down) === AIR) {
      // If air below, move down
      currentSandPosition = down;
    } else if (getCaveCell(cave, leftDown) === AIR) {
      // If air in leftDown, move leftDown
      currentSandPosition = leftDown;
    } else if (getCaveCell(cave, rightDown) === AIR) {
      // If air in rightDown, move rightDown
      currentSandPosition = rightDown;
    } else {
      // Else rest sand and start over
      cave[y][x] = REST;
      sandCount++;
      currentSandPosition = [...sandEntrance];
    }
  }

  printCave(cave);

  console.log("part 1", sandCount);
})();

// Part 2
(() => {
  const cave = getCave();
  const airRow: Air[] = [...Array(caveWidth).keys()].map(() => AIR);
  const floorRow: Rock[] = [...Array(caveWidth).keys()].map(() => ROCK);

  cave.push(airRow);
  cave.push(floorRow);

  const floorIndex = cave.length - 1;

  let sandEntrance: Coordinate = [500 - smallestX, 0];
  let blocked = false;
  let sandCount = 0;
  let currentSandPosition: Coordinate = [...sandEntrance];
  let dynamicCaveWidth = caveWidth;

  const appendAir = () => {
    for (const [rowI, row] of cave.entries()) {
      if (rowI < floorIndex) {
        row.push(AIR);
      } else {
        row.push(ROCK);
      }
    }
  };

  const prependAir = () => {
    for (const [rowI, row] of cave.entries()) {
      if (rowI < floorIndex) {
        row.unshift(AIR);
      } else {
        row.unshift(ROCK);
      }
    }
  };

  while (!blocked) {
    const x = currentSandPosition[0];
    const y = currentSandPosition[1];

    const down: Coordinate = [x, y + 1];
    const leftDown: Coordinate = [x - 1, y + 1];
    const rightDown: Coordinate = [x + 1, y + 1];

    if (y === floorIndex - 1) {
      // If we've reached the floor, start over
      cave[y][x] = REST;
      sandCount++;
      currentSandPosition = [...sandEntrance];
    } else if (getCaveCell(cave, down) === AIR) {
      // If air below, move down
      currentSandPosition = down;
    } else if (leftDown[0] === -1) {
      // If moving left-down requires a new column of air
      prependAir();
      currentSandPosition = [0, leftDown[1]];
      sandEntrance[0] += 1;
      dynamicCaveWidth += 1;
    } else if (rightDown[0] > dynamicCaveWidth - 1) {
      // If moving right-down requires a new column of air
      appendAir();
      currentSandPosition = rightDown;
      dynamicCaveWidth += 1;
    } else if (getCaveCell(cave, leftDown) === AIR) {
      // If left-down is air
      currentSandPosition = leftDown;
    } else if (getCaveCell(cave, rightDown) === AIR) {
      // If right-down is air
      currentSandPosition = rightDown;
    } else if (sandEntrance[0] === x && sandEntrance[1] === y) {
      // If we're at the sand entrance, block the entrance and STOP
      cave[y][x] = REST;
      sandCount++;
      blocked = true;
    } else {
      // Else rest current sand and start over
      cave[y][x] = REST;
      sandCount++;
      currentSandPosition = [...sandEntrance];
    }
  }

  printCave(cave);

  console.log("part 2", sandCount);
})();
