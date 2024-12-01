import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const getNumColumns = () => {
  const col1: number[] = [];
  const col2: number[] = [];

  puzzleInput.split("\n").forEach((line) => {
    const [num1, num2] = line.split("   ");

    col1.push(parseInt(num1));
    col2.push(parseInt(num2));
  });

  return { col1, col2 };
};

// Part 1
(() => {
  console.time("part 1");
  const { col1, col2 } = getNumColumns();

  col1.sort((a, b) => a - b);
  col2.sort((a, b) => a - b);

  const totalDistance = col1.reduce((acc, num1, index) => {
    return acc + Math.abs(num1 - col2[index]);
  }, 0);

  console.log("part1 totalDistance ::", totalDistance);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  const { col1, col2 } = getNumColumns();

  const similarityScore = col1.reduce((acc, num1) => {
    const appearanceCount = col2.filter((num2) => num2 === num1).length;

    return acc + num1 * appearanceCount;
  }, 0);

  console.log("part2 similarityScore ::", similarityScore);
  console.timeEnd("part 2");
})();
