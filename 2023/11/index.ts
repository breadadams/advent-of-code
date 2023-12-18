import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  const universe = [...lines];

  const populatedX = new Set<number>();
  const populatedY = new Set<number>();

  for (const [y, line] of universe.entries()) {
    if (line.includes("#")) {
      populatedY.add(y);

      for (let x = 0; x < line.length; x++) {
        const char = line[x];

        if (char === "#") {
          populatedX.add(x);
        }
      }
    }
  }

  const emptyX: number[] = [];
  const emptyY: number[] = [];

  for (let y = 0; y < universe.length; y++) {
    if (!populatedY.has(y)) {
      emptyY.push(y);
    }
  }

  for (let x = 0; x < universe.length; x++) {
    if (!populatedX.has(x)) {
      emptyX.push(x);
    }
  }

  const blankLine = universe[0]
    .split("")
    .map(() => ".")
    .join("");

  let expandedUniverse = [...universe];

  for (const [i, y] of emptyY.entries()) {
    expandedUniverse.splice(y + i, 0, blankLine);
  }

  for (const [i, x] of emptyX.entries()) {
    for (let y = 0; y < expandedUniverse.length; y++) {
      const row = expandedUniverse[y].split("");

      row.splice(x + i, 0, ".");

      expandedUniverse[y] = row.join("");
    }
  }

  const galaxyCoordinates = new Set<`${number},${number}`>();

  for (const [y, line] of expandedUniverse.entries()) {
    if (line.includes("#")) {
      for (let x = 0; x < line.length; x++) {
        if (line[x] === "#") {
          galaxyCoordinates.add(`${x},${y}`);
        }
      }
    }
  }

  const shortestPaths = new Map<
    `${number},${number}`,
    Map<`${number},${number}`, number>
  >();

  for (const [coordinateA] of galaxyCoordinates.entries()) {
    const distances = new Map<`${number},${number}`, number>();

    for (const [coordinateB] of galaxyCoordinates.entries()) {
      if (coordinateA !== coordinateB && !shortestPaths.has(coordinateB)) {
        const [xA, yA] = coordinateA.split(",").map((c) => +c);
        const [xB, yB] = coordinateB.split(",").map((c) => +c);

        const xDiff = Math.abs(xA - xB);
        const yDiff = Math.abs(yA - yB);

        distances.set(coordinateB, xDiff + yDiff);
      }
    }

    shortestPaths.set(coordinateA, distances);
  }

  let shortestPathsSum = 0;

  for (const [, distances] of shortestPaths.entries()) {
    for (const [, distance] of distances.entries()) {
      shortestPathsSum += distance;
    }
  }

  console.log("part 1 - shortestPathsSum", shortestPathsSum);

  console.timeEnd("part 1");
})();
