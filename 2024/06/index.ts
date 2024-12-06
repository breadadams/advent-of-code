import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const map = puzzleInput.split("\n").map((row) => row.split(""));
const GUARD_STARTING_CHAR = "^";
const OBSTACLE_CHAR = "#";
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
} as const;

const DIRECTION_KEYS = Object.keys(DIRECTIONS) as Array<
  keyof typeof DIRECTIONS
>;

const MAP_WIDTH = map[0].length;
const MAP_HEIGHT = map.length;

type GuardPosition = {
  x: number;
  y: number;
  direction: keyof typeof DIRECTIONS;
};

const startY = map.findIndex((row) => row.includes(GUARD_STARTING_CHAR));
const startX = map[startY].indexOf(GUARD_STARTING_CHAR);

const getVisitedCells = ({
  enableLoopDetection,
  keyFormatter = ({ x, y }) => `${x},${y}`,
  mapInput,
}: {
  enableLoopDetection?: boolean;
  keyFormatter?: (guardPos: GuardPosition) => string;
  mapInput: typeof map;
}) => {
  let guardPosition: GuardPosition = { x: startX, y: startY, direction: "UP" };
  let loopDetected = false;

  const visitedCells = new Set<string>();
  visitedCells.add(keyFormatter(guardPosition));

  while (true) {
    const nextMove = DIRECTIONS[guardPosition.direction];
    const nextPosition = {
      x: guardPosition.x + nextMove.x,
      y: guardPosition.y + nextMove.y,
    };

    if (
      nextPosition.x < 0 ||
      nextPosition.x >= MAP_WIDTH ||
      nextPosition.y < 0 ||
      nextPosition.y >= MAP_HEIGHT
    ) {
      break;
    }

    const nextCell = mapInput[nextPosition.y][nextPosition.x];

    if (nextCell === OBSTACLE_CHAR) {
      const nextDirection =
        DIRECTION_KEYS[
          (DIRECTION_KEYS.indexOf(guardPosition.direction) + 1) %
            DIRECTION_KEYS.length
        ];

      guardPosition.direction = nextDirection;
      continue;
    }

    guardPosition.x = nextPosition.x;
    guardPosition.y = nextPosition.y;
    const nextKey = keyFormatter(guardPosition);

    if (enableLoopDetection && visitedCells.has(nextKey)) {
      loopDetected = true;
      break;
    }

    visitedCells.add(nextKey);
  }

  return { loopDetected, visitedCells };
};

// Part 1
(() => {
  console.time("part 1");

  const { visitedCells } = getVisitedCells({ mapInput: map });

  console.log("part 1 visitedCells count ::", visitedCells.size);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");

  const { visitedCells } = getVisitedCells({ mapInput: map });
  let loopsFound = 0;

  for (let visitedCell of visitedCells) {
    const [x, y] = visitedCell.split(",").map((n) => parseInt(n));

    if (x === startX && y === startY) {
      continue;
    }

    const mapClone = JSON.parse(JSON.stringify(map)) as typeof map;
    mapClone[y][x] = OBSTACLE_CHAR;

    const { loopDetected } = getVisitedCells({
      enableLoopDetection: true,
      keyFormatter: (guardPos) =>
        `${guardPos.x},${guardPos.y},${guardPos.direction}`,
      mapInput: mapClone,
    });

    if (loopDetected) {
      loopsFound += 1;
    }
  }

  console.log("part 2 loopsFound ::", loopsFound);
  console.timeEnd("part 2");
})();
