import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const topoMap = puzzleInput.split("\n").map((row) => row.split("").map(Number));

const MAP_HEIGHT = topoMap.length;
const MAP_WIDTH = topoMap[0].length;

const DIRECTIONS = {
  UP: [0, -1],
  RIGHT: [1, 0],
  DOWN: [0, 1],
  LEFT: [-1, 0],
};

const getStartingPoints = () => {
  const startingPoints: Array<[number, number]> = [];

  for (let y = 0; y < topoMap.length; y++) {
    for (let x = 0; x < topoMap[0].length; x++) {
      const cell = topoMap[y][x];

      if (cell === 0) {
        startingPoints.push([x, y]);
      }
    }
  }

  return startingPoints;
};

// Part 1
(() => {
  console.time("part 1");
  const startingPoints = getStartingPoints();
  let totalScore = 0;

  for (const [startingX, startingY] of startingPoints) {
    const reachedGoals = new Set<string>();
    const queue = [[startingX, startingY]];

    while (queue.length) {
      const [x, y] = queue.pop();
      const currentCell = topoMap[y][x];

      for (const direction in DIRECTIONS) {
        const [dirX, dirY] = DIRECTIONS[direction];

        const newX = x + dirX;
        const newY = y + dirY;

        if (newX >= MAP_WIDTH || newX < 0 || newY >= MAP_HEIGHT || newY < 0) {
          continue;
        }
        const newCell = topoMap[newY][newX];

        if (newCell === currentCell + 1) {
          if (newCell === 9) {
            reachedGoals.add(`${newX},${newY}`);
            continue;
          }

          queue.push([newX, newY]);
        }
      }
    }

    totalScore += reachedGoals.size;
  }

  console.log("part 1 totalScore ::", totalScore);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  const startingPoints = getStartingPoints();
  let totalScore = 0;

  for (const [startingX, startingY] of startingPoints) {
    let score = 0;
    const queue = [[startingX, startingY]];

    while (queue.length) {
      const [x, y] = queue.pop();
      const currentCell = topoMap[y][x];

      for (const direction in DIRECTIONS) {
        const [dirX, dirY] = DIRECTIONS[direction];

        const newX = x + dirX;
        const newY = y + dirY;

        if (newX >= MAP_WIDTH || newX < 0 || newY >= MAP_HEIGHT || newY < 0) {
          continue;
        }
        const newCell = topoMap[newY][newX];

        if (newCell === currentCell + 1) {
          if (newCell === 9) {
            score += 1;
            continue;
          }

          queue.push([newX, newY]);
        }
      }
    }

    totalScore += score;
  }

  console.log("part 2 totalScore ::", totalScore);
  console.timeEnd("part 2");
})();
