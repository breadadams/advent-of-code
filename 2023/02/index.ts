import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  const MAX_RED = 12;
  const MAX_GREEN = 13;
  const MAX_BLUE = 14;

  let totals = 0;

  for (const line of lines) {
    const [name, stats] = line.replaceAll(";", ",").split(": ");

    const colorCounts = stats.split(",").map((str) => str.trim());

    const redCounts = colorCounts
      .filter((str) => str.includes(" red"))
      .map((str) => +str.replace(" red", ""));

    const greenCounts = colorCounts
      .filter((str) => str.includes(" green"))
      .map((str) => +str.replace(" green", ""));

    const blueCounts = colorCounts
      .filter((str) => str.includes(" blue"))
      .map((str) => +str.replace(" blue", ""));

    if (
      Math.max(...redCounts) <= MAX_RED &&
      Math.max(...greenCounts) <= MAX_GREEN &&
      Math.max(...blueCounts) <= MAX_BLUE
    ) {
      totals += +name.replace("Game ", "");
    }
  }

  console.log("part 1 - totals:", totals);

  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.log("=========");
  console.time("part 2");

  let totals = 0;

  for (const line of lines) {
    const [, stats] = line.replaceAll(";", ",").split(": ");

    const colorCounts = stats.split(",").map((str) => str.trim());

    const redCounts = colorCounts
      .filter((str) => str.includes(" red"))
      .map((str) => +str.replace(" red", ""));

    const greenCounts = colorCounts
      .filter((str) => str.includes(" green"))
      .map((str) => +str.replace(" green", ""));

    const blueCounts = colorCounts
      .filter((str) => str.includes(" blue"))
      .map((str) => +str.replace(" blue", ""));

    totals +=
      Math.max(...redCounts) *
      Math.max(...greenCounts) *
      Math.max(...blueCounts);
  }

  console.log("part 2 - totals:", totals);

  console.timeEnd("part 2");
})();
