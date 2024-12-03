import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const sumMuls = (input: string) => {
  return input.match(/mul\((\d+,\d+)\)/gm).reduce((acc, mul) => {
    const [num1, num2] = mul.replace("mul(", "").replace(")", "").split(",");

    return acc + parseInt(num1) * parseInt(num2);
  }, 0);
};

// Part 1
(() => {
  console.time("part 1");
  const total = sumMuls(puzzleInput);
  console.log("part1 total ::", total);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  const puzzle = puzzleInput.replaceAll("\n", "");

  const DO_OPERATOR = "do()";
  const DONT_OPERATOR = "don't()";

  const DO_KEYWORD = "%%DO%%";
  const DONT_KEYWORD = "%%DON'T%%";

  const withDoesAndDonts = puzzle
    .split(DONT_OPERATOR)
    .flatMap((entry) => [entry, DONT_KEYWORD])
    .slice(0, -1)
    .flatMap((entry) => {
      if (entry === DONT_KEYWORD) {
        return entry;
      }

      if (entry.includes(DO_OPERATOR)) {
        return entry
          .split(DO_OPERATOR)
          .flatMap((subEntry) => [subEntry, DO_KEYWORD])
          .slice(0, -1);
      }

      return entry;
    });

  let enabled = true;
  let newPuzzle = "";

  for (let i = 0; i < withDoesAndDonts.length; i++) {
    const entry = withDoesAndDonts[i];

    if (entry === DO_KEYWORD) {
      enabled = true;
    } else if (entry === DONT_KEYWORD) {
      enabled = false;
    } else if (enabled) {
      newPuzzle += entry;
    }
  }

  const total = sumMuls(newPuzzle);

  console.log("part2 total ::", total);
  console.timeEnd("part 2");
})();
