import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

const histories = lines.map((line) => line.split(" ").map((num) => +num));

const getSubsequence = (sequence: number[]) => {
  const subsequence: number[] = [];

  for (let i = 1; i < sequence.length; i++) {
    const prevValue = sequence[i - 1];
    const value = sequence[i];

    subsequence.push(value - prevValue);
  }

  return subsequence;
};

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  let total = 0;

  for (const history of histories) {
    const sequences: number[][] = [history];

    while (!sequences[sequences.length - 1].every((v) => v === 0)) {
      const subsequence = getSubsequence(sequences[sequences.length - 1]);

      sequences.push(subsequence);
    }

    for (let i = sequences.length - 1; i >= 0; i--) {
      const subsequence = sequences[i];

      if (i === sequences.length - 1) {
        subsequence.push(0);
      } else {
        const prevSubsequence = sequences[i + 1];
        const prevLastNumber = prevSubsequence[prevSubsequence.length - 1];
        const lastNumber = subsequence[subsequence.length - 1];

        subsequence.push(prevLastNumber + lastNumber);
      }
    }

    total += sequences[0][sequences[0].length - 1];
  }

  console.log("part 1 - total", total);

  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.log("=========");
  console.time("part 2");

  let total = 0;

  for (const history of histories) {
    const sequences: number[][] = [history];

    while (!sequences[sequences.length - 1].every((v) => v === 0)) {
      const subsequence = getSubsequence(sequences[sequences.length - 1]);

      sequences.push(subsequence);
    }

    for (let i = sequences.length - 1; i >= 0; i--) {
      const subsequence = sequences[i];

      if (i === sequences.length - 1) {
        subsequence.unshift(0);
      } else {
        const prevSubsequence = sequences[i + 1];
        const prevFirstNumber = prevSubsequence[0];
        const firstNumber = subsequence[0];

        subsequence.unshift(firstNumber - prevFirstNumber);
      }
    }

    total += sequences[0][0];
  }

  console.log("part 2 - total", total);

  console.timeEnd("part 2");
})();
