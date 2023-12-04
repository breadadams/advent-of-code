import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  const symbols = Array.from(
    new Set(
      lines
        .join("")
        .split("")
        .filter((str) => str !== "." && Number.isNaN(+str))
    )
  );

  let total = 0;

  for (let y = 0; y < lines.length; y++) {
    const row = lines[y] + "."; // append an extra empty cell

    let number = "";

    for (let x = 0; x < row.length; x++) {
      const col = row[x];

      if (!Number.isNaN(+col)) {
        number = `${number}${col}`;
      } else if (number.length) {
        const numberAsNumber = +number;
        let matchedFromAboveOrBelow = false;

        for (let i = x - number.length - 1; i < x + 1; i++) {
          if (i > 0 && i < row.length) {
            if (
              (y > 0 && symbols.includes(lines[y - 1][i])) ||
              (y < lines.length - 1 && symbols.includes(lines[y + 1][i]))
            ) {
              total += numberAsNumber;
              matchedFromAboveOrBelow = true;
              break;
            }
          }
        }

        if (!matchedFromAboveOrBelow) {
          const left = x - number.length - 1;

          if (
            (left >= 0 && symbols.includes(row[left])) ||
            (x < row.length && symbols.includes(col))
          ) {
            total += numberAsNumber;
          }
        }

        number = "";
      }
    }
  }

  console.log("part 1 - total:", total);

  console.timeEnd("part 1");
})();
