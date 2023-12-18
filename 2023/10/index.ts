import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

const gridWidth = lines[0].length - 1;
const gridHeight = lines.length - 1;

type Coordinates = { x: number; y: number };

const getStartingCoordinates = (): Coordinates => {
  const y = lines.findIndex((line) => line.includes("S"));
  const x = lines[y].indexOf("S");

  return { x, y };
};

const coordToKey = ({ x, y }: Coordinates) => `${x},${y}`;

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  const start = getStartingCoordinates();

  const seen = new Set([coordToKey(start)]);
  const queue = [start];

  while (queue.length) {
    const { x, y } = queue.shift();
    const char = lines[y][x];

    const northPos = { x, y: y - 1 };
    const northKey = coordToKey(northPos);

    if (
      y > 0 &&
      !seen.has(northKey) &&
      ["S", "|", "J", "L"].includes(char) &&
      ["|", "7", "F"].includes(lines[northPos.y][x])
    ) {
      seen.add(northKey);
      queue.push(northPos);
    }

    const southPos = { x, y: y + 1 };
    const southKey = coordToKey(southPos);

    if (
      y < gridHeight &&
      !seen.has(southKey) &&
      ["S", "|", "7", "F"].includes(char) &&
      ["|", "J", "L"].includes(lines[southPos.y][x])
    ) {
      seen.add(southKey);
      queue.push(southPos);
    }

    const eastPos = { x: x - 1, y };
    const eastKey = coordToKey(eastPos);

    if (
      x > 0 &&
      !seen.has(eastKey) &&
      ["S", "-", "7", "J"].includes(char) &&
      ["-", "F", "L"].includes(lines[y][eastPos.x])
    ) {
      seen.add(eastKey);
      queue.push(eastPos);
    }

    const westPos = { x: x + 1, y };
    const westKey = coordToKey(westPos);

    if (
      x < gridWidth &&
      !seen.has(westKey) &&
      ["S", "-", "F", "L"].includes(char) &&
      ["-", "7", "J"].includes(lines[y][westPos.x])
    ) {
      seen.add(westKey);
      queue.push(westPos);
    }
  }

  console.log("part 1 - furthest away", [...seen.keys()].length / 2);

  console.timeEnd("part 1");
})();
