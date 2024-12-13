import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const farm = puzzleInput.split("\n").map((row) => row.split(""));

const FARM_HEIGHT = farm.length;
const FARM_WIDTH = farm[0].length;

type Coordinate = { x: number; y: number };

const directions = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
} satisfies Record<string, Coordinate>;

const diagonalDirections = {
  RIGHT_UP: { x: 1, y: -1 },
  RIGHT_DOWN: { x: 1, y: 1 },
  LEFT_DOWN: { x: -1, y: 1 },
  LEFT_UP: { x: -1, y: -1 },
} satisfies Record<string, Coordinate>;

const getCellKey = (cell: Coordinate) => `${cell.x},${cell.y}`;

const getCellFromKey = (key: string) => {
  const [x, y] = key.split(",").map(Number);

  return { x, y };
};

const move = (cell: Coordinate, direction: Coordinate) => {
  return { x: cell.x + direction.x, y: cell.y + direction.y };
};

const getRegions = () => {
  const visited = new Set<string>();
  const regions = new Map<string, { type: string; cells: Set<string> }>();

  for (let y = 0; y < FARM_HEIGHT; y++) {
    for (let x = 0; x < FARM_WIDTH; x++) {
      const currentCellKey = getCellKey({ x, y });
      if (visited.has(currentCellKey)) {
        continue;
      }

      const currentCell = farm[y][x];

      regions.set(currentCellKey, {
        type: currentCell,
        cells: new Set([currentCellKey]),
      });
      const cells = regions.get(currentCellKey).cells;

      const queue = [{ x, y }];
      const visitedInner = new Set<string>();

      while (queue.length) {
        const cell = queue.shift();
        const cellKey = getCellKey(cell);

        if (visitedInner.has(cellKey)) {
          continue;
        }
        visitedInner.add(cellKey);

        for (const direction of Object.values(directions)) {
          const nextCell = move(cell, direction);
          const nextCellKey = getCellKey(nextCell);

          if (visitedInner.has(nextCellKey)) {
            continue;
          }

          if (
            nextCell.x < 0 ||
            nextCell.x >= FARM_WIDTH ||
            nextCell.y < 0 ||
            nextCell.y >= FARM_HEIGHT
          ) {
            continue;
          }

          const nextCellValue = farm[nextCell.y][nextCell.x];

          if (nextCellValue === currentCell) {
            queue.push(nextCell);
            visited.add(nextCellKey);
            cells.add(nextCellKey);
          }
        }
      }
    }
  }

  return regions;
};

// Part 1
(() => {
  console.time("part 1");
  const regions = getRegions();
  let totalPrice = 0;

  for (const [, region] of regions) {
    const area = region.cells.size;
    let perimeter = 0;

    for (const regionCellKey of region.cells) {
      const cell = getCellFromKey(regionCellKey);

      for (const direction of Object.values(directions)) {
        const neighbourCell = {
          x: cell.x + direction.x,
          y: cell.y + direction.y,
        };

        if (farm?.[neighbourCell.y]?.[neighbourCell.x] !== region.type) {
          perimeter++;
        }
      }
    }

    totalPrice += area * perimeter;
  }

  console.log("part 1 totalPrice ::", totalPrice);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  const regions = getRegions();
  let totalPrice = 0;

  for (const [, region] of regions) {
    let corners = 0;

    if (region.cells.size === 1) {
      totalPrice += 4;
      continue;
    }

    for (const cellKey of region.cells) {
      const cell = getCellFromKey(cellKey);

      /* **************
       * OUTER CORNERS
       * **************/

      const upCellKey = getCellKey(move(cell, directions.UP));
      const rightCellKey = getCellKey(move(cell, directions.RIGHT));
      const downCellKey = getCellKey(move(cell, directions.DOWN));
      const leftCellKey = getCellKey(move(cell, directions.LEFT));

      // Outer top-left corner
      if (!region.cells.has(leftCellKey) && !region.cells.has(upCellKey)) {
        corners++;
      }

      // Outer top-right corner
      if (!region.cells.has(upCellKey) && !region.cells.has(rightCellKey)) {
        corners++;
      }

      // Outer bottom-right corner
      if (!region.cells.has(rightCellKey) && !region.cells.has(downCellKey)) {
        corners++;
      }

      // Outer bottom-left corner
      if (!region.cells.has(downCellKey) && !region.cells.has(leftCellKey)) {
        corners++;
      }

      /* **************
       * INNER CORNERS
       * **************/

      const rightUpCellKey = getCellKey(
        move(cell, diagonalDirections.RIGHT_UP)
      );
      const rightDownCellKey = getCellKey(
        move(cell, diagonalDirections.RIGHT_DOWN)
      );
      const leftDownCellKey = getCellKey(
        move(cell, diagonalDirections.LEFT_DOWN)
      );
      const leftUpCellKey = getCellKey(move(cell, diagonalDirections.LEFT_UP));

      // Inner top-left corner
      if (
        region.cells.has(rightCellKey) &&
        region.cells.has(downCellKey) &&
        !region.cells.has(rightDownCellKey)
      ) {
        corners++;
      }

      // Inner top-right corner
      if (
        region.cells.has(leftCellKey) &&
        region.cells.has(downCellKey) &&
        !region.cells.has(leftDownCellKey)
      ) {
        corners++;
      }

      // Inner bottom-right corner
      if (
        region.cells.has(leftCellKey) &&
        region.cells.has(upCellKey) &&
        !region.cells.has(leftUpCellKey)
      ) {
        corners++;
      }

      // Inner bottom-left corner
      if (
        region.cells.has(rightCellKey) &&
        region.cells.has(upCellKey) &&
        !region.cells.has(rightUpCellKey)
      ) {
        corners++;
      }
    }

    totalPrice += region.cells.size * corners;
  }

  console.log("part 2 totalPrice ::", totalPrice);
  console.timeEnd("part 2");
})();
