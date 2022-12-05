import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const rucksacks = puzzleInput.split("\n");

const findMatch = (rucksack: string) => {
  const center = Math.floor(rucksack.length / 2);
  const part1 = rucksack.slice(0, center);
  const part2 = rucksack.slice(center, rucksack.length);

  const match = [...part1].find((p) => part2.includes(p));

  return match;
};

const getScore = (letter?: string) => {
  if (!letter) {
    return 0;
  }

  const score = letter.toLowerCase().charCodeAt(0) - 97 + 1;

  if (letter === letter.toUpperCase()) {
    return score + 26;
  }

  return score;
};

const sum = (acc: number, score: number) => acc + score;

// Part 1
const matches = rucksacks.map(findMatch);
const scores = matches.map(getScore);
const total = scores.reduce(sum, 0);

// console.log(total);

// Part 2
const groupBadges = rucksacks
  .filter((_, i) => i % 3 === 0)
  .map((rucksack, i) => {
    const match = [...rucksack].find(
      (r) =>
        rucksacks[i * 3 + 1].includes(r) && rucksacks[i * 3 + 2].includes(r)
    );

    return match;
  });

const groupBadgeScores = groupBadges.map(getScore);
const groupBadgeTotal = groupBadgeScores.reduce(sum, 0);

console.log(groupBadgeTotal);
