import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

const getNumberOfMatches = (str: string) => {
  const [winningNumbersStr, numbersYouHaveStr] = str.trim().split(" | ");

  const winningNumbers = winningNumbersStr
    .split(" ")
    .filter(Boolean)
    .map((numStr) => +numStr);

  const numbersYouHave = numbersYouHaveStr
    .split(" ")
    .filter(Boolean)
    .map((numStr) => +numStr);

  const matches = numbersYouHave.filter((num) => winningNumbers.includes(num));

  return matches.length;
};

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  let totalPoints = 0;

  for (const line of lines) {
    const [, numbersStr] = line.split(":");
    const matches = getNumberOfMatches(numbersStr);

    if (matches) {
      let score = 1;

      for (let i = 0; i < matches - 1; i++) {
        score *= 2;
      }

      totalPoints += score;
    }
  }

  console.log("part 1 - total:", totalPoints);

  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.log("=========");
  console.time("part 2");

  let totalCards = lines.length;
  const wonCardsMap = new Map<number, number[]>();
  const cardsWonIndices: number[] = [];

  for (const [lineIndex, line] of lines.entries()) {
    const [, numbersStr] = line.split(":");
    const matches = getNumberOfMatches(numbersStr);
    const cardsWonForLine = [];

    if (matches) {
      for (let i = 1; i <= matches; i++) {
        const indexWon = lineIndex + i;

        if (indexWon < lines.length) {
          cardsWonForLine.push(indexWon);
        }
      }
    }

    totalCards += cardsWonForLine.length;
    cardsWonIndices.push(...cardsWonForLine);
    wonCardsMap.set(lineIndex, cardsWonForLine);
  }

  for (let i = 0; i < cardsWonIndices.length; i++) {
    const cardIndex = cardsWonIndices[i];
    const cardsWonForCard = wonCardsMap.get(cardIndex);

    totalCards += cardsWonForCard.length;
    cardsWonIndices.push(...cardsWonForCard);
  }

  console.log("part 2 - total:", totalCards);

  console.timeEnd("part 2");
})();
