import { timePart1, timePart2 } from "../../utils/time-part";

const parseInput = (input: string) => {
  return input.split("\n").map((row) => row.split(""));
};

type InputMap = ReturnType<typeof parseInput>;

const findCell = (char: string, map: InputMap) => {
  const y = map.findIndex((row) => row.includes(char));
  const x = map[y].indexOf(char);

  return { x, y };
};

const getStartingPosition = (map: InputMap) => findCell("S", map);
const getEndPosition = (map: InputMap) => findCell("E", map);

const DIRECTIONS = ["N", "E", "S", "W"] as const;
type Direction = (typeof DIRECTIONS)[number];

type Coordinate = { x: number; y: number };

const positionToKey = (position: Coordinate, direction?: Direction) => {
  const positionKey = `${position.x},${position.y}`;

  if (direction) {
    return `${positionKey}:${direction}`;
  }

  return positionKey;
};

const rotate = (
  direction: Direction,
  { clockwise } = { clockwise: true }
): Direction => {
  if (direction === "N" && !clockwise) {
    return "W";
  }

  return DIRECTIONS[
    (DIRECTIONS.indexOf(direction) + (clockwise ? 1 : -1)) % DIRECTIONS.length
  ];
};

const MOVEMENTS = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
} satisfies Record<Direction, Coordinate>;

const move = (position: Coordinate, direction: Direction) => {
  const movement = MOVEMENTS[direction];

  return { x: position.x + movement.x, y: position.y + movement.y };
};

const readCell = ({ x, y }: Coordinate, map: InputMap) => map[y]?.[x];

type QueueEntry = {
  direction: Direction;
  position: Coordinate;
  score: number;
  visited: Coordinate[];
};

const getBestScore = (map: InputMap) => {
  const start = getStartingPosition(map);
  const end = getEndPosition(map);

  const queue: QueueEntry[] = [
    {
      direction: "E",
      position: start,
      score: 0,
      visited: [start],
    },
  ];

  const globalVisited = new Set<string>();
  let bestScore: number | null = null;

  while (queue.length) {
    queue.sort((a, b) => a.score - b.score);

    const route = queue.shift()!;
    const baseKey = positionToKey(route.position, route.direction);

    if (globalVisited.has(baseKey)) {
      continue;
    }
    globalVisited.add(baseKey);

    if (route.position.x === end.x && route.position.y === end.y) {
      if (typeof bestScore !== "number" || route.score < bestScore) {
        bestScore = route.score;
      }

      continue;
    }

    const movedForward = move(route.position, route.direction);
    const cell = readCell(movedForward, map);

    if (cell !== "#") {
      queue.push({
        ...route,
        position: movedForward,
        score: route.score + 1,
        visited: [...route.visited, movedForward],
      });
    }

    queue.push({
      ...route,
      direction: rotate(route.direction),
      score: route.score + 1000,
      visited: [...route.visited],
    });

    queue.push({
      ...route,
      direction: rotate(route.direction, { clockwise: false }),
      score: route.score + 1000,
      visited: [...route.visited],
    });
  }

  return bestScore ?? 0;
};

export const part1 = timePart1((input: string) => {
  const map = parseInput(input);
  const bestScore = getBestScore(map);

  return bestScore;
});

export const part2 = timePart2((input: string) => {
  const map = parseInput(input);
  const bestScore = getBestScore(map);
  const startingPosition = getStartingPosition(map);
  const endPosition = getEndPosition(map);

  const queue: QueueEntry[] = [
    {
      visited: [startingPosition],
      position: startingPosition,
      direction: "E",
      score: 0,
    },
  ];

  const globalVisited = new Map<string, number>();
  const pathsToEnd: QueueEntry["visited"][] = [];

  while (queue.length) {
    const route = queue.shift()!;
    const baseKey = positionToKey(route.position, route.direction);

    if (
      route.score > bestScore ||
      (globalVisited.has(baseKey) && globalVisited.get(baseKey)! < route.score)
    ) {
      continue;
    }

    globalVisited.set(baseKey, route.score);

    if (
      route.position.x === endPosition.x &&
      route.position.y === endPosition.y &&
      route.score === bestScore
    ) {
      pathsToEnd.push(route.visited);
      continue;
    }

    const movedForward = move(route.position, route.direction);
    const cell = readCell(movedForward, map);

    if (cell !== "#") {
      queue.push({
        ...route,
        position: movedForward,
        score: route.score + 1,
        visited: [...route.visited, movedForward],
      });
    }

    queue.push({
      ...route,
      direction: rotate(route.direction),
      score: route.score + 1000,
      visited: [...route.visited],
    });

    queue.push({
      ...route,
      direction: rotate(route.direction, { clockwise: false }),
      score: route.score + 1000,
      visited: [...route.visited],
    });
  }

  const bestSeats = new Set<string>();

  for (const pathToGoal of pathsToEnd) {
    for (const position of pathToGoal) {
      const key = positionToKey(position);
      bestSeats.add(key);
    }
  }

  return bestSeats.size;
});
