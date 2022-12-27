import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const valley = puzzleInput.split("\n").map((row) => row.split(""));
const valleyHeight = valley.length - 1;
const valleyWidth = valley[0].length - 1;

const start = { x: valley[0].indexOf("."), y: 0 };
const end = { x: valley[valleyHeight].indexOf("."), y: valleyHeight };

type Direction = "<" | ">" | "^" | "v";
type Position = { x: number; y: number };

type Blizzard = { position: Position; direction: Direction };

const getInitialBlizzards = () => {
  const initialBlizzards: Blizzard[] = [];

  for (let y = 1; y < valleyHeight; y++) {
    for (let x = 1; x < valleyWidth; x++) {
      if (valley[y][x] !== ".") {
        initialBlizzards.push({
          position: { x, y },
          direction: valley[y][x] as Direction,
        });
      }
    }
  }

  return initialBlizzards;
};

// Part 1
(() => {
  console.time("part 1");

  const blizzards = getInitialBlizzards();
  let queue: Position[] = [{ ...start }];
  let nextQueue: Position[] = [];
  const nextQueueKeys = new Set();

  let hasReachedEnd = false;
  let minute = 0;

  const getStateScore = (state: Position) =>
    Math.abs(end.x - state.x) + Math.abs(end.y - state.y);

  while (!hasReachedEnd) {
    const blizzardPositions = new Set();

    // Move blizzards
    for (const blizzard of blizzards) {
      if (blizzard.direction === ">") {
        if (blizzard.position.x < valleyWidth - 1) {
          blizzard.position.x++;
        } else {
          blizzard.position.x = 1;
        }
      }

      if (blizzard.direction === "<") {
        if (blizzard.position.x > 1) {
          blizzard.position.x--;
        } else {
          blizzard.position.x = valleyWidth - 1;
        }
      }

      if (blizzard.direction === "v") {
        if (blizzard.position.y < valleyHeight - 1) {
          blizzard.position.y++;
        } else {
          blizzard.position.y = 1;
        }
      }

      if (blizzard.direction === "^") {
        if (blizzard.position.y > 1) {
          blizzard.position.y--;
        } else {
          blizzard.position.y = valleyHeight - 1;
        }
      }

      blizzardPositions.add(`${blizzard.position.x},${blizzard.position.y}`);
    }

    for (const { x, y } of queue) {
      if (x === end.x && y === end.y) {
        hasReachedEnd = true;
        break;
      }

      if (y > 0 && y < valleyHeight) {
        // Move Left
        const leftKey = `${x - 1},${y}`;
        if (
          x > 1 &&
          !blizzardPositions.has(leftKey) &&
          !nextQueueKeys.has(leftKey)
        ) {
          nextQueue.push({ x: x - 1, y });
          nextQueueKeys.add(leftKey);
        }

        // Move right
        const rightKey = `${x + 1},${y}`;
        if (
          x < valleyWidth - 1 &&
          !blizzardPositions.has(rightKey) &&
          !nextQueueKeys.has(rightKey)
        ) {
          nextQueue.push({ x: x + 1, y });
          nextQueueKeys.add(rightKey);
        }
      }

      // Move up
      const upKey = `${x},${y - 1}`;
      if (y > 1 && !blizzardPositions.has(upKey) && !nextQueueKeys.has(upKey)) {
        nextQueue.push({ x, y: y - 1 });
        nextQueueKeys.add(upKey);
      }

      // Move down
      const downKey = `${x},${y + 1}`;
      if (
        y < valleyHeight - 1 &&
        !blizzardPositions.has(downKey) &&
        !nextQueueKeys.has(downKey)
      ) {
        nextQueue.push({ x, y: y + 1 });
        nextQueueKeys.add(downKey);
      }

      // Move down when in the cell above the exit
      const aboveExitKey = `${x},${y + 1}`;
      if (x === end.x && y === end.y - 1 && !nextQueueKeys.has(aboveExitKey)) {
        nextQueue.push({ x, y: y + 1 });
        nextQueueKeys.add(aboveExitKey);
      }

      // Wait in same position
      const waitKey = `${x},${y}`;
      if (!nextQueueKeys.has(waitKey) && !blizzardPositions.has(waitKey)) {
        nextQueue.push({ x, y });
        nextQueueKeys.add(waitKey);
      }
    }

    if (!hasReachedEnd) {
      queue = nextQueue
        .map((state) => ({ state, score: getStateScore(state) }))
        .sort((a, b) => a.score - b.score)
        .map((s) => s.state);
      nextQueue = [];
      nextQueueKeys.clear();

      minute++;
    }
  }

  console.log("part 1", minute);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");

  const blizzards = getInitialBlizzards();
  let queue: Position[] = [{ ...start }];
  let nextQueue: Position[] = [];
  const nextQueueKeys = new Set();

  let destination = end;
  let hasReachedEnd = false;
  let hasRecoveredSnacks = false;
  let hasReachedEndAgain = false;
  let minute = 0;

  const getStateScore = (state: Position, dest: Position) =>
    Math.abs(dest.x - state.x) + Math.abs(dest.y - state.y);

  while (!hasReachedEnd || !hasRecoveredSnacks || !hasReachedEndAgain) {
    const blizzardPositions = new Set();

    // Move blizzards
    for (const blizzard of blizzards) {
      if (blizzard.direction === ">") {
        if (blizzard.position.x < valleyWidth - 1) {
          blizzard.position.x++;
        } else {
          blizzard.position.x = 1;
        }
      }

      if (blizzard.direction === "<") {
        if (blizzard.position.x > 1) {
          blizzard.position.x--;
        } else {
          blizzard.position.x = valleyWidth - 1;
        }
      }

      if (blizzard.direction === "v") {
        if (blizzard.position.y < valleyHeight - 1) {
          blizzard.position.y++;
        } else {
          blizzard.position.y = 1;
        }
      }

      if (blizzard.direction === "^") {
        if (blizzard.position.y > 1) {
          blizzard.position.y--;
        } else {
          blizzard.position.y = valleyHeight - 1;
        }
      }

      blizzardPositions.add(`${blizzard.position.x},${blizzard.position.y}`);
    }

    for (const { x, y } of queue) {
      if (!hasReachedEnd && x === end.x && y === end.y) {
        hasReachedEnd = true;
        nextQueue = [{ ...end }];
        destination = start;
        break;
      }

      if (
        hasReachedEnd &&
        !hasRecoveredSnacks &&
        x === start.x &&
        y === start.y
      ) {
        hasRecoveredSnacks = true;
        nextQueue = [{ ...start }];
        destination = end;
        break;
      }

      if (hasReachedEnd && hasRecoveredSnacks && x === end.x && y === end.y) {
        hasReachedEndAgain = true;
        break;
      }

      if (y > 0 && y < valleyHeight) {
        // Move Left
        const leftKey = `${x - 1},${y}`;
        if (
          x > 1 &&
          !blizzardPositions.has(leftKey) &&
          !nextQueueKeys.has(leftKey)
        ) {
          nextQueue.push({ x: x - 1, y });
          nextQueueKeys.add(leftKey);
        }

        // Move right
        const rightKey = `${x + 1},${y}`;
        if (
          x < valleyWidth - 1 &&
          !blizzardPositions.has(rightKey) &&
          !nextQueueKeys.has(rightKey)
        ) {
          nextQueue.push({ x: x + 1, y });
          nextQueueKeys.add(rightKey);
        }
      }

      // Move up
      const upKey = `${x},${y - 1}`;
      if (y > 1 && !blizzardPositions.has(upKey) && !nextQueueKeys.has(upKey)) {
        nextQueue.push({ x, y: y - 1 });
        nextQueueKeys.add(upKey);
      }

      // Move down
      const downKey = `${x},${y + 1}`;
      if (
        y < valleyHeight - 1 &&
        !blizzardPositions.has(downKey) &&
        !nextQueueKeys.has(downKey)
      ) {
        nextQueue.push({ x, y: y + 1 });
        nextQueueKeys.add(downKey);
      }

      // Move down when in the cell above the exit
      const aboveExitKey = `${x},${y + 1}`;
      if (x === end.x && y === end.y - 1 && !nextQueueKeys.has(aboveExitKey)) {
        nextQueue.push({ x, y: y + 1 });
        nextQueueKeys.add(aboveExitKey);
      }

      // Move up when in the cell below the entrance
      const belowEntranceKey = `${x},${y - 1}`;
      if (
        x === start.x &&
        y === start.y + 1 &&
        !nextQueueKeys.has(belowEntranceKey)
      ) {
        nextQueue.push({ x, y: y - 1 });
        nextQueueKeys.add(belowEntranceKey);
      }

      // Wait in same position
      const waitKey = `${x},${y}`;
      if (!nextQueueKeys.has(waitKey) && !blizzardPositions.has(waitKey)) {
        nextQueue.push({ x, y });
        nextQueueKeys.add(waitKey);
      }
    }

    if (!hasReachedEnd || !hasRecoveredSnacks || !hasReachedEndAgain) {
      queue = nextQueue
        .map((state) => ({ state, score: getStateScore(state, destination) }))
        .sort((a, b) => a.score - b.score)
        .map((s) => s.state);
      nextQueue = [];
      nextQueueKeys.clear();

      minute++;
    }
  }

  console.log("part 2", minute);
  console.timeEnd("part 2");
})();
