import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

const getFirstNumberInString = (str: string) => {
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const asNumber = +char;

    if (!Number.isNaN(asNumber)) {
      return char;
    }
  }

  return "";
};

const reverseString = (str: string) => str.split("").reverse().join("");

// Part 1
(() => {
  console.time("part 1");

  let total = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const firstNumber = getFirstNumberInString(line);
    const lastNumber = getFirstNumberInString(reverseString(line));

    total += +`${firstNumber}${lastNumber}`;
  }

  console.log("part 1 - total:", total);

  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");

  const numDict: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  const numKeys = Object.keys(numDict);

  let total = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const numIndices: Record<number, string> = {};

    for (const numKey of numKeys) {
      const index = line.indexOf(numKey);
      const lastIndex = line.lastIndexOf(numKey);

      if (index > -1) {
        numIndices[index] = numKey;
      }

      if (lastIndex > -1) {
        numIndices[lastIndex] = numKey;
      }
    }

    const numIndicesKeys = Object.keys(numIndices).map((index) => +index);
    let strStart = line;
    let strEnd = line;

    if (numIndicesKeys.length) {
      const lowestIndex = Math.min(...numIndicesKeys);
      const highestIndex = Math.max(...numIndicesKeys);

      strStart = strStart.replaceAll(
        numIndices[lowestIndex],
        numDict[numIndices[lowestIndex]]
      );

      strEnd = strEnd.replaceAll(
        numIndices[highestIndex],
        numDict[numIndices[highestIndex]]
      );
    }

    const firstNumber = getFirstNumberInString(strStart);
    const lastNumber = getFirstNumberInString(reverseString(strEnd));

    total += +`${firstNumber}${lastNumber}`;
  }

  console.log("part 2 - total:", total);

  console.timeEnd("part 2");
})();
