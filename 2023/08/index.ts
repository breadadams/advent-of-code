import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const [directions, linesStr] = puzzleInput.split("\n\n");
const lines = linesStr.split("\n");

const directionIndices = directions
  .replaceAll("L", "0")
  .replaceAll("R", "1")
  .split("")
  .map((d) => +d);

const nodeArr = lines.map((line) => {
  const [key, paths] = line.split(" = ");

  const pathsArr = paths.replace("(", "").replace(")", "").split(", ");

  return [key, pathsArr] as const;
});

const nodeMap = new Map(nodeArr);

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  let stepCount = 0;
  let position = "AAA";

  while (position !== "ZZZ") {
    const direction = directionIndices[stepCount % directionIndices.length];

    position = nodeMap.get(position)[direction];
    stepCount++;
  }

  console.log("part 1 - stepCount", stepCount);

  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.log("=========");
  console.time("part 2");

  let positions = nodeArr
    .map((node) => node[0])
    .filter((nodeKey) => nodeKey.endsWith("A"));

  let stepCounts: number[] = [];

  const gcd = (a: number, b: number) => {
    if (!b) return a;

    return gcd(b, a % b);
  };

  const lcm = (a: number, b: number) => {
    return (a * b) / gcd(a, b);
  };

  for (let i = 0; i < positions.length; i++) {
    let position = positions[i];
    let stepCount = 0;

    while (!position.endsWith("Z")) {
      const direction = directionIndices[stepCount % directionIndices.length];

      position = nodeMap.get(position)[direction];
      stepCount++;
    }

    stepCounts[i] = stepCount;
  }

  console.log("part 2 - lcm stepCount", stepCounts.reduce(lcm));

  console.timeEnd("part 2");
})();
