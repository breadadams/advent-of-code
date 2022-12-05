import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const pairs = puzzleInput.split("\n");

// Part 1
const pairsFullyContaining = pairs.filter((pair) => {
  const [one, two] = pair.split(",");
  const [oneA, oneB] = one.split("-");
  const [twoA, twoB] = two.split("-");

  const numOneA = Number(oneA);
  const numOneB = Number(oneB);
  const numTwoA = Number(twoA);
  const numTwoB = Number(twoB);

  return (
    (numOneA >= numTwoA && numOneB <= numTwoB) ||
    (numTwoA >= numOneA && numTwoB <= numOneB)
  );
});

console.log("Part 1 res:", pairsFullyContaining.length);

// Part 2
const pairsOverlap = pairs.filter((pair) => {
  const [one, two] = pair.split(",");
  const [oneA, oneB] = one.split("-");
  const [twoA, twoB] = two.split("-");

  const numOneA = Number(oneA);
  const numOneB = Number(oneB);
  const numTwoA = Number(twoA);
  const numTwoB = Number(twoB);

  return (
    (numOneA >= numTwoA && numOneA <= numTwoB) ||
    (numTwoA >= numOneA && numTwoA <= numOneB)
  );
});

console.log("Part 2 res:", pairsOverlap.length);
