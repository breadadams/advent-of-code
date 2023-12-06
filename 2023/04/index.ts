import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  let totalPoints = 0;

  for (const line of lines) {
    const [, numbersStr] = line.split(":");
    const [winningNumbersStr, numbersYouHaveStr] = numbersStr
      .trim()
      .split(" | ");

    const winningNumbers = winningNumbersStr
      .split(" ")
      .filter(Boolean)
      .map((numStr) => +numStr);

    const numbersYouHave = numbersYouHaveStr
      .split(" ")
      .filter(Boolean)
      .map((numStr) => +numStr);

    const matches = numbersYouHave.filter((num) =>
      winningNumbers.includes(num)
    );

    if (matches.length) {
      let score = 1;

      for (let i = 0; i < matches.length - 1; i++) {
        score *= 2;
      }

      totalPoints += score;
    }
  }

  console.log("part 1 - total:", totalPoints);

  console.timeEnd("part 1");
})();
