import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const [directions, linesStr] = puzzleInput.split("\n\n");
const lines = linesStr.split("\n");

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

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
