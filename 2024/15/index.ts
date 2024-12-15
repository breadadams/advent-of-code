import { timePart1, timePart2 } from "../../utils/time-part";

const parseInput = (input: string) => {
  const [rawMap, rawMovements] = input.split("\n\n");

  const map = rawMap.split("\n").map((row) => row.split(""));
  const movements = rawMovements.split("\n").join("").split("");

  return { map, movements };
};

type InputMap = ReturnType<typeof parseInput>["map"];
type Coordinate = { x: number; y: number };

const getInitialPosition = (map: InputMap) => {
  const y = map.findIndex((row) => row.includes("@"));
  const x = map[y].indexOf("@");

  return { x, y };
};

const movementDirections = {
  "<": { x: -1, y: 0 },
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
};

const move = (position: Coordinate, direction: Coordinate) => {
  return {
    x: position.x + direction.x,
    y: position.y + direction.y,
  };
};

const readCell = ({ x, y }: Coordinate, map: InputMap) => {
  return map[y][x];
};

const findNextEmptyCell = ({
  boxCells = ["O"],
  currentPosition,
  direction,
  map,
}: {
  boxCells?: string[];
  currentPosition: Coordinate;
  direction: Coordinate;
  map: InputMap;
}) => {
  let position = currentPosition;
  let i = 0;

  while (true) {
    const nextPos = move(position, direction);
    const cell = readCell(nextPos, map);

    if (cell === ".") {
      position = nextPos;
      break;
    }

    if (boxCells.includes(cell)) {
      position = nextPos;
      i++;
      continue;
    }

    if (cell === "#") {
      i = 0;
      position = currentPosition;
      break;
    }
  }

  return {
    movementCount: i,
    emptyCellPosition: position,
  };
};

// const buildMapForPrint = (map: InputMap, currentPosition?: Coordinate) => {
//   const innerMap = JSON.parse(JSON.stringify(map)) as ReturnType<
//     typeof parseInput
//   >["map"];

//   if (currentPosition) {
//     innerMap[currentPosition.y][currentPosition.x] = "@";
//   }

//   return innerMap.map((row) => row.join("")).join("\n");
// };

// const printMap = (map: InputMap, currentPosition?: Coordinate) => {
//   console.log(buildMapForPrint(map, currentPosition));
// };

const getGPSCoordinateSum = (map: InputMap, matchingChar: string) => {
  let gpsCoordSum = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const cell = readCell({ x, y }, map);

      if (cell === matchingChar) {
        gpsCoordSum += 100 * y + x;
      }
    }
  }

  return gpsCoordSum;
};

export const part1 = timePart1((input: string) => {
  const { map, movements } = parseInput(input);
  let currentPosition = getInitialPosition(map);
  map[currentPosition.y][currentPosition.x] = ".";

  for (const movement of movements) {
    const direction =
      movementDirections[movement as keyof typeof movementDirections];

    const nextPosition = {
      x: currentPosition.x + direction.x,
      y: currentPosition.y + direction.y,
    };

    const cell = readCell(nextPosition, map);

    if (cell === "#") {
      continue;
    }

    if (cell === ".") {
      currentPosition = nextPosition;
      continue;
    }

    if (cell === "O") {
      const nextEmptyCell = findNextEmptyCell({
        currentPosition,
        direction,
        map,
      });

      if (nextEmptyCell.movementCount === 0) {
        continue;
      }

      currentPosition = nextPosition;
      map[currentPosition.y][currentPosition.x] = ".";

      for (let j = 1; j <= nextEmptyCell.movementCount; j++) {
        const blockPushPos = {
          x: currentPosition.x + direction.x * j,
          y: currentPosition.y + direction.y * j,
        };

        map[blockPushPos.y][blockPushPos.x] = "O";
      }
    }
  }

  return getGPSCoordinateSum(map, "O");
});

const expandMap = (input: string) => {
  const [map, movements] = input.split("\n\n");

  const expandedMap = map
    .replaceAll("#", "##")
    .replaceAll("O", "[]")
    .replaceAll(".", "..")
    .replaceAll("@", "@.");

  return `${expandedMap}\n\n${movements}`;
};

const positionToKey = (position: Coordinate) => `${position.x},${position.y}`;

const moveBoxesVertically = ({
  // debug,
  direction,
  map,
  initialPosition,
}: {
  // debug?: boolean;
  direction: Coordinate;
  map: InputMap;
  initialPosition: Coordinate;
}) => {
  const visited = new Set<string>();
  let toMove: Coordinate[] = [];
  const queue = [initialPosition];

  while (queue.length) {
    const position = queue.pop()!;

    const key = positionToKey(position);

    if (visited.has(key)) {
      continue;
    }

    const cell = readCell(position, map);

    // We hit a wall
    if (cell === "#") {
      toMove = [];
      break;
    }

    // We're on a "]" char
    if (cell === "[") {
      toMove.push(position);
      queue.push({ ...position, x: position.x + 1 });
      queue.push(move(position, direction));
    }

    // We're on a "[" char
    if (cell === "]") {
      toMove.push(position);
      queue.push({ ...position, x: position.x - 1 });
      queue.push(move(position, direction));
    }

    visited.add(key);
  }

  const sortedToMove = toMove.toSorted((a, b) => {
    if (direction.y === 1) {
      return b.y - a.y || b.x - a.x;
    }

    return a.y - b.y || a.x - b.x;
  });

  for (const pos of sortedToMove) {
    const withMove = move(pos, direction);
    const cell = readCell(pos, map);

    map[withMove.y][withMove.x] = cell;
    map[pos.y][pos.x] = ".";
  }

  return { hasMoved: toMove.length };
};

export const part2 = timePart2((input: string) => {
  const inputWithExpandedMap = expandMap(input);
  const { map, movements } = parseInput(inputWithExpandedMap);

  let currentPosition = getInitialPosition(map);
  map[currentPosition.y][currentPosition.x] = ".";

  let i = 0;

  for (const movement of movements) {
    i++;

    const direction =
      movementDirections[movement as keyof typeof movementDirections];

    const nextPosition = {
      x: currentPosition.x + direction.x,
      y: currentPosition.y + direction.y,
    };

    const cell = readCell(nextPosition, map);

    if (cell === "#") {
      continue;
    }

    if (cell === ".") {
      currentPosition = nextPosition;
      continue;
    }

    if (cell === "[" || cell === "]") {
      if (movement === "<" || movement === ">") {
        const nextEmptyCell = findNextEmptyCell({
          boxCells: ["[", "]"],
          currentPosition,
          direction,
          map,
        });

        if (nextEmptyCell.movementCount === 0) {
          continue;
        }

        currentPosition = nextPosition;
        map[currentPosition.y][currentPosition.x] = ".";

        for (let j = 1; j <= nextEmptyCell.movementCount; j++) {
          const blockPushPos = {
            x: currentPosition.x + direction.x * j,
            y: currentPosition.y + direction.y * j,
          };

          map[blockPushPos.y][blockPushPos.x] =
            j % 2 === 0
              ? movement === "<"
                ? "["
                : "]"
              : movement === ">"
              ? "["
              : "]";
        }
      }

      if (movement === "^" || movement === "v") {
        const withMove = move(currentPosition, direction);
        const { hasMoved } = moveBoxesVertically({
          direction,
          map,
          initialPosition: withMove,
        });

        if (hasMoved) {
          currentPosition = withMove;
        }

        continue;
      }
    }
  }

  return getGPSCoordinateSum(map, "[");
});
