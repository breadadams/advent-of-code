import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  const formatLine = (line: string) =>
    line
      .split(":")[1]
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((str) => +str.trim());

  const timeArr = formatLine(lines[0]);
  const distanceArr = formatLine(lines[1]);

  let total = 1;

  for (let i = 0; i < timeArr.length; i++) {
    const time = timeArr[i];
    const distanceHighScore = distanceArr[i];

    let waysToBeat = 0;

    for (let j = 0; j <= time; j++) {
      const distanceTravelled = (time - j) * j;

      if (distanceTravelled > distanceHighScore) {
        waysToBeat++;
      }
    }

    total *= waysToBeat;
  }

  console.log("part 1 - total", total);

  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.log("=========");
  console.time("part 2");

  const formatLine = (line: string) =>
    +line
      .split(":")[1]
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((str) => str.trim())
      .join("");

  const time = formatLine(lines[0]);
  const distanceHighScore = formatLine(lines[1]);

  let total = 0;

  for (let j = 0; j <= time; j++) {
    const distanceTravelled = (time - j) * j;

    if (distanceTravelled > distanceHighScore) {
      total++;
    }
  }

  console.log("part 2 - total", total);

  console.timeEnd("part 2");
})();
