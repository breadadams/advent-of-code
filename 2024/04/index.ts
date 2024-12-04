import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const wordsearch = puzzleInput.split("\n").map((row) => row.split(""));

const WIDTH = wordsearch[0].length;
const HEIGHT = wordsearch.length;

const XMAS = "XMAS";

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];

type Coordinate = { x: number; y: number };

const DIRECTION_MAP = {
  N: { x: 0, y: -1 },
  NE: { x: 1, y: -1 },
  E: { x: 1, y: 0 },
  SE: { x: 1, y: 1 },
  S: { x: 0, y: 1 },
  SW: { x: -1, y: 1 },
  W: { x: -1, y: 0 },
  NW: { x: -1, y: -1 },
} as const satisfies Record<string, Coordinate>;

const isOutOfBounds = (coord: Coordinate) => {
  return coord.x < 0 || coord.x >= WIDTH || coord.y < 0 || coord.y >= HEIGHT;
};

// Part 1
(() => {
  console.time("part 1");
  type QueueEntry = {
    chars: string[];
    direction: keyof typeof DIRECTION_MAP | undefined;
    position: Coordinate;
  };

  let matches = 0;
  const queue: QueueEntry[] = [];

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const char = wordsearch[y][x];

      if (char === XMAS[0]) {
        queue.push({
          chars: [char],
          direction: undefined,
          position: { x, y },
        });
      }
    }
  }

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.chars.length === XMAS.length) {
      matches += 1;
      continue;
    }

    const nextChar = XMAS[current.chars.length];

    if (typeof current.direction === "undefined") {
      for (const element of Object.entries(DIRECTION_MAP) as Entries<
        typeof DIRECTION_MAP
      >) {
        const [key, direction] = element;
        const nextCell = {
          x: current.position.x + direction.x,
          y: current.position.y + direction.y,
        };

        if (isOutOfBounds(nextCell)) {
          continue;
        }

        if (wordsearch[nextCell.y][nextCell.x] === nextChar) {
          queue.push({
            chars: [...current.chars, nextChar],
            direction: key,
            position: nextCell,
          });
        }
      }
    } else {
      const direction = DIRECTION_MAP[current.direction];

      const nextCell = {
        x: current.position.x + direction.x,
        y: current.position.y + direction.y,
      };

      if (isOutOfBounds(nextCell)) {
        continue;
      }

      if (wordsearch[nextCell.y][nextCell.x] === nextChar) {
        queue.push({
          chars: [...current.chars, nextChar],
          direction: current.direction,
          position: nextCell,
        });
      }
    }
  }

  console.log("part 1 matches ::", matches);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  let matches = 0;
  const centerPoints: Coordinate[] = [];

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const char = wordsearch[y][x];

      if (char === "A") {
        centerPoints.push({ x, y });
      }
    }
  }

  for (let i = 0; i < centerPoints.length; i++) {
    const point = centerPoints[i];

    const topRightCoord = {
      x: point.x + DIRECTION_MAP.NE.x,
      y: point.y + DIRECTION_MAP.NE.y,
    };

    const bottomRightCoord = {
      x: point.x + DIRECTION_MAP.SE.x,
      y: point.y + DIRECTION_MAP.SE.y,
    };

    const bottomLeftCoord = {
      x: point.x + DIRECTION_MAP.SW.x,
      y: point.y + DIRECTION_MAP.SW.y,
    };

    const topLeftCoord = {
      x: point.x + DIRECTION_MAP.NW.x,
      y: point.y + DIRECTION_MAP.NW.y,
    };

    if (
      isOutOfBounds(topRightCoord) ||
      isOutOfBounds(bottomRightCoord) ||
      isOutOfBounds(bottomLeftCoord) ||
      isOutOfBounds(topLeftCoord)
    ) {
      continue;
    }

    const topLeftChar = wordsearch[topLeftCoord.y][topLeftCoord.x];
    const bottomLeftChar = wordsearch[bottomLeftCoord.y][bottomLeftCoord.x];
    const bottomRightChar = wordsearch[bottomRightCoord.y][bottomRightCoord.x];
    const topRightChar = wordsearch[topRightCoord.y][topRightCoord.x];

    if (
      ((topLeftChar === "M" && bottomRightChar === "S") ||
        (topLeftChar === "S" && bottomRightChar === "M")) &&
      ((bottomLeftChar === "M" && topRightChar === "S") ||
        (bottomLeftChar === "S" && topRightChar === "M"))
    ) {
      matches += 1;
    }
  }

  console.log("part 2 matches ::", matches);
  console.timeEnd("part 2");
})();
