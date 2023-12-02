import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);
const lines = puzzleInput.split("\n");

// Part 1
(() => {
  console.time("part 1");

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

  let total = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const firstNumber = getFirstNumberInString(line);
    const lastNumber = getFirstNumberInString(
      line.split("").reverse().join("")
    );

    total += +`${firstNumber}${lastNumber}`;
  }

  console.log("total", total);

  console.timeEnd("part 1");
})();
