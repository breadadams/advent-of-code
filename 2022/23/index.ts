import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

type PositionKey = `${number},${number}`;
type PositionValues = [number, number];

const grove = puzzleInput.split("\n").map((row) => row.split(""));

const getInitialElfPositions = () => {
  const positions = new Map<PositionKey, PositionValues>();

  for (let y = 0; y < grove.length; y++) {
    const row = grove[y];

    for (let x = 0; x < row.length; x++) {
      const cell = row[x];

      if (cell === "#") {
        positions.set(`${x},${y}`, [x, y]);
      }
    }
  }

  return positions;
};

const NORTH = "N";
const SOUTH = "S";
const WEST = "W";
const EAST = "E";

type NeighbourCell = { key: PositionKey; position: PositionValues };
type NeighbourCells = {
  northWest: NeighbourCell;
  north: NeighbourCell;
  northEast: NeighbourCell;
  east: NeighbourCell;
  southEast: NeighbourCell;
  south: NeighbourCell;
  southWest: NeighbourCell;
  west: NeighbourCell;
};

const neighbourCells = new Map<PositionKey, NeighbourCells>();

const getNeighbours = (x: number, y: number) => {
  const key: PositionKey = `${x},${y}`;

  if (neighbourCells.has(key)) {
    return neighbourCells.get(key)!;
  }

  const west = x - 1;
  const east = x + 1;
  const north = y - 1;
  const south = y + 1;

  const neighbours: NeighbourCells = {
    northWest: { key: `${west},${north}`, position: [west, north] },
    north: { key: `${x},${north}`, position: [x, north] },
    northEast: { key: `${east},${north}`, position: [east, north] },
    east: { key: `${east},${y}`, position: [east, y] },
    southEast: { key: `${east},${south}`, position: [east, south] },
    south: { key: `${x},${south}`, position: [x, south] },
    southWest: { key: `${west},${south}`, position: [west, south] },
    west: { key: `${west},${y}`, position: [west, y] },
  };

  neighbourCells.set(key, neighbours);

  return neighbours;
};

const bumpCount = (
  key: PositionKey,
  positionCounts: Record<string, number>
) => {
  if (key in positionCounts) {
    positionCounts[key]++;
    return;
  }

  positionCounts[key] = 1;
};

const checkElfPositions = (
  elfPositions: Map<PositionKey, PositionValues>,
  ...neighbours: NeighbourCell[]
) => neighbours.map((n) => n.key).some((key) => elfPositions.has(key));

// Part 1
(() => {
  console.time("part 1");

  const directions = [NORTH, SOUTH, WEST, EAST];

  let elfPositions = getInitialElfPositions();
  let nextElfPositions: Array<{
    key: PositionKey;
    position: PositionValues;
    previous: { key: PositionKey; position: PositionValues };
  }> = [];
  let positionCounts: Record<PositionKey, number> = {};

  for (let round = 0; round < 10; round++) {
    for (const [positionKey, positionValues] of elfPositions) {
      const previous = { key: positionKey, position: positionValues };
      const [x, y] = positionValues;
      const neighbours = getNeighbours(x, y);

      if (checkElfPositions(elfPositions, ...Object.values(neighbours))) {
        let hasMoved = false;

        for (const direction of directions) {
          if (direction === NORTH) {
            if (
              !checkElfPositions(
                elfPositions,
                neighbours.northWest,
                neighbours.north,
                neighbours.northEast
              )
            ) {
              nextElfPositions.push({ ...neighbours.north, previous });
              bumpCount(neighbours.north.key, positionCounts);
              hasMoved = true;
              break;
            }
          }

          if (direction === EAST) {
            if (
              !checkElfPositions(
                elfPositions,
                neighbours.northEast,
                neighbours.east,
                neighbours.southEast
              )
            ) {
              nextElfPositions.push({ ...neighbours.east, previous });
              bumpCount(neighbours.east.key, positionCounts);
              hasMoved = true;
              break;
            }
          }

          if (direction === SOUTH) {
            if (
              !checkElfPositions(
                elfPositions,
                neighbours.southWest,
                neighbours.south,
                neighbours.southEast
              )
            ) {
              nextElfPositions.push({ ...neighbours.south, previous });
              bumpCount(neighbours.south.key, positionCounts);
              hasMoved = true;
              break;
            }
          }

          if (direction === WEST) {
            if (
              !checkElfPositions(
                elfPositions,
                neighbours.northWest,
                neighbours.west,
                neighbours.southWest
              )
            ) {
              nextElfPositions.push({ ...neighbours.west, previous });
              bumpCount(neighbours.west.key, positionCounts);
              hasMoved = true;
              break;
            }
          }
        }

        if (!hasMoved) {
          nextElfPositions.push({ ...previous, previous });
          bumpCount(previous.key, positionCounts);
        }
      } else {
        nextElfPositions.push({ ...previous, previous });
        bumpCount(previous.key, positionCounts);
      }
    }

    elfPositions = new Map(
      nextElfPositions.map((p) => {
        if (positionCounts[p.key] > 1) {
          return [p.previous.key, p.previous.position];
        }

        return [p.key, p.position];
      })
    );
    nextElfPositions = [];
    positionCounts = {};

    const firstDirection = directions.shift()!;
    directions.push(firstDirection);
  }

  const elfPositionValues = [...elfPositions.values()];
  const finalXPositions = elfPositionValues.map((p) => p[0]);
  const finalYPositions = elfPositionValues.map((p) => p[1]);

  const lowestX = Math.min(...finalXPositions);
  const highestX = Math.max(...finalXPositions);
  const lowestY = Math.min(...finalYPositions);
  const highestY = Math.max(...finalYPositions);

  const width = highestX - lowestX + 1;
  const height = highestY - lowestY + 1;

  const availableArea = width * height - elfPositions.size;

  console.log("part 1", availableArea);

  console.timeEnd("part 1");
})();

(() => {
  console.time("part 2");

  const directions = [NORTH, SOUTH, WEST, EAST];

  let elfPositions = getInitialElfPositions();
  let nextElfPositions: Array<{
    key: PositionKey;
    position: PositionValues;
    previous: { key: PositionKey; position: PositionValues };
  }> = [];
  let positionCounts: Record<PositionKey, number> = {};

  let round = 1;

  while (true) {
    let safeElves = 0;

    for (const [positionKey, positionValues] of elfPositions) {
      const previous = { key: positionKey, position: positionValues };
      const [x, y] = positionValues;
      const neighbours = getNeighbours(x, y);

      if (checkElfPositions(elfPositions, ...Object.values(neighbours))) {
        let hasMoved = false;

        for (const direction of directions) {
          if (direction === NORTH) {
            if (
              !checkElfPositions(
                elfPositions,
                neighbours.northWest,
                neighbours.north,
                neighbours.northEast
              )
            ) {
              nextElfPositions.push({ ...neighbours.north, previous });
              bumpCount(neighbours.north.key, positionCounts);
              hasMoved = true;
              break;
            }
          }

          if (direction === EAST) {
            if (
              !checkElfPositions(
                elfPositions,
                neighbours.northEast,
                neighbours.east,
                neighbours.southEast
              )
            ) {
              nextElfPositions.push({ ...neighbours.east, previous });
              bumpCount(neighbours.east.key, positionCounts);
              hasMoved = true;
              break;
            }
          }

          if (direction === SOUTH) {
            if (
              !checkElfPositions(
                elfPositions,
                neighbours.southWest,
                neighbours.south,
                neighbours.southEast
              )
            ) {
              nextElfPositions.push({ ...neighbours.south, previous });
              bumpCount(neighbours.south.key, positionCounts);
              hasMoved = true;
              break;
            }
          }

          if (direction === WEST) {
            if (
              !checkElfPositions(
                elfPositions,
                neighbours.northWest,
                neighbours.west,
                neighbours.southWest
              )
            ) {
              nextElfPositions.push({ ...neighbours.west, previous });
              bumpCount(neighbours.west.key, positionCounts);
              hasMoved = true;
              break;
            }
          }
        }

        if (!hasMoved) {
          nextElfPositions.push({ ...previous, previous });
          bumpCount(previous.key, positionCounts);
        }
      } else {
        nextElfPositions.push({ ...previous, previous });
        bumpCount(previous.key, positionCounts);
        safeElves++;
      }
    }

    if (safeElves === elfPositions.size) {
      console.log("part 2", round);
      break;
    }

    elfPositions = new Map(
      nextElfPositions.map((p) => {
        if (positionCounts[p.key] > 1) {
          return [p.previous.key, p.previous.position];
        }

        return [p.key, p.position];
      })
    );
    nextElfPositions = [];
    positionCounts = {};
    round++;

    const firstDirection = directions.shift()!;
    directions.push(firstDirection);
  }

  console.timeEnd("part 2");
})();
