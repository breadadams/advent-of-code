import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const calorieGroups = puzzleInput
  .split("\n\n")
  .map((s) => s.split("\n").reduce((acc, n) => acc + Number(n), 0));

const largestGroup = Math.max(...calorieGroups);

console.log("part 1", largestGroup);

const sortedGroups = calorieGroups.sort((a, b) => {
  if (a < b) {
    return 1;
  }

  if (a > b) {
    return -1;
  }

  return 0;
});

const topThreeGroups = sortedGroups[0] + sortedGroups[1] + sortedGroups[2];

console.log("part 2", topThreeGroups);
