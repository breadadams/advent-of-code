import { timePart1, timePart2 } from "../../utils/time-part";

type Coordinate = { x: number; y: number };

const parseInput = (input: string) => {
  const coords = input.split("\n").map((coord) => {
    const [x, y] = coord.split(",").map(Number);

    return { x, y } satisfies Coordinate;
  });

  return coords;
};

const createGrid = (size: number) =>
  [...Array(size).keys()].map(() => [...Array(size).keys()].map(() => "."));

type Grid = ReturnType<typeof createGrid>;

const populateGrid = (grid: Grid, obstacles: Coordinate[]) => {
  const newGrid = JSON.parse(JSON.stringify(grid)) as typeof grid;

  for (let i = 0; i < obstacles.length; i++) {
    const coord = obstacles[i];
    newGrid[coord.y][coord.x] = "#";
  }

  return newGrid;
};

const printGrid = (grid: Grid) => {
  console.log(grid.map((row) => row.join("")).join("\n"));
};

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
};

type Direction = keyof typeof DIRECTIONS;

const move = ({ x, y }: Coordinate, dirKey: Direction) => {
  const direction = DIRECTIONS[dirKey];

  return { x: x + direction.x, y: y + direction.y };
};

const coordToKey = ({ x, y }: Coordinate) => `${x},${y}`;

class BinaryMinHeap {
  private heap: Array<{
    position: Coordinate;
    count: number;
    visited: Coordinate[];
  }>;

  constructor() {
    this.heap = [];
  }

  getParentIndex(index: number) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index: number) {
    return 2 * index + 1;
  }

  getRightChildIndex(index: number) {
    return 2 * index + 2;
  }

  swap(index1: number, index2: number) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  // Insert a new element into the heap
  insert(element: (typeof this.heap)[number]) {
    this.heap.push(element);
    this.bubbleUp();
  }

  bubbleUp() {
    let index = this.heap.length - 1;

    while (
      index > 0 &&
      this.heap[index].count < this.heap[this.getParentIndex(index)].count
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  // Remove and return the smallest element
  extractMin() {
    if (this.heap.length === 1) return this.heap.pop()!;

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown();
    return min;
  }

  bubbleDown() {
    let index = 0;

    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);

      if (
        this.getRightChildIndex(index) < this.heap.length &&
        this.heap[this.getRightChildIndex(index)].count <
          this.heap[this.getLeftChildIndex(index)].count
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.heap[index].count <= this.heap[smallerChildIndex].count) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

const getLowestStepCount = ({
  grid,
  gridSize,
}: {
  grid: Grid;
  gridSize: number;
}) => {
  const start = { x: 0, y: 0 };
  const end = { x: gridSize, y: gridSize };
  const visited = new Map<string, number>();
  let lowestStepCount = Number.MAX_SAFE_INTEGER;

  const queue = new BinaryMinHeap();
  queue.insert({ position: start, count: 0, visited: [start] });

  while (!queue.isEmpty()) {
    const entry = queue.extractMin()!;
    const key = coordToKey(entry.position);

    if (visited.has(key) && visited.get(key)! <= entry.count) {
      continue;
    }

    visited.set(key, entry.count);

    if (entry.position.x === end.x && entry.position.y === end.y) {
      if (entry.count < lowestStepCount) {
        lowestStepCount = entry.count;
      }

      continue;
    }

    for (const direction of Object.keys(DIRECTIONS) as Direction[]) {
      const newPosition = move(entry.position, direction);
      const nextCount = entry.count + 1;

      if (
        newPosition.x >= 0 &&
        newPosition.x <= gridSize &&
        newPosition.y >= 0 &&
        newPosition.y <= gridSize &&
        grid[newPosition.y][newPosition.x] !== "#" &&
        nextCount < lowestStepCount
      ) {
        queue.insert({
          position: newPosition,
          count: entry.count + 1,
          visited: [...entry.visited, newPosition],
        });
      }
    }
  }

  return lowestStepCount;
};

export const part1 = timePart1(
  (input: string, gridSize: number, byteCount: number) => {
    const coords = parseInput(input);
    const grid = populateGrid(
      createGrid(gridSize + 1),
      coords.slice(0, byteCount)
    );

    return getLowestStepCount({ grid, gridSize });
  }
);

export const part2 = timePart2(
  (input: string, gridSize: number, byteCount: number) => {
    const coords = parseInput(input);
    const baseGrid = createGrid(gridSize + 1);

    // @todo: optimize
    for (let i = byteCount + 1; i < coords.length; i++) {
      const grid = populateGrid(baseGrid, coords.slice(0, i + 1));

      const lowestStepCount = getLowestStepCount({ grid, gridSize });

      if (lowestStepCount === Number.MAX_SAFE_INTEGER) {
        return coordToKey(coords[i]);
      }
    }
  }
);
