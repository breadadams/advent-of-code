import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

let [_orderingRules, _pagesToProduce] = puzzleInput.split("\n\n");

const orderingRules = _orderingRules
  .split("\n")
  .map((row) => row.split("|").map((num) => parseInt(num)));

const pagesToProduce = _pagesToProduce
  .split("\n")
  .map((row) => row.split(",").map((num) => parseInt(num)));

const arePagesValid = (row: number[]) => {
  let isValid = true;

  for (let j = 0; j < row.length; j++) {
    const page = row[j];
    const relevantRules = orderingRules.filter((rule) => rule.includes(page));

    if (!relevantRules.length) {
      break;
    }

    for (let k = 0; k < row.length; k++) {
      const otherPage = row[k];
      if (k === j) {
        continue;
      }

      const rule = relevantRules.find((rule) => rule.includes(otherPage));

      if (
        (k < j && rule.indexOf(otherPage) === 1) ||
        (k > j && rule.indexOf(otherPage) === 0)
      ) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      break;
    }
  }

  return isValid;
};

// Part 1
(() => {
  console.time("part 1");

  let total = 0;

  for (let i = 0; i < pagesToProduce.length; i++) {
    const row = pagesToProduce[i];
    let isValid = arePagesValid(row);

    if (isValid) {
      total += row[Math.floor(row.length / 2)];
    }
  }

  console.log("total part 1 ::", total);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");

  let total = 0;
  let invalidUpdates: typeof orderingRules = [];

  for (let i = 0; i < pagesToProduce.length; i++) {
    const row = pagesToProduce[i];
    let isValid = arePagesValid(row);

    if (!isValid) {
      invalidUpdates.push(row);
    }
  }

  for (let i = 0; i < invalidUpdates.length; i++) {
    const row = [...invalidUpdates[i]];

    row.sort((a, b) => {
      const rule = orderingRules.find(
        (rule) =>
          (rule[0] === a && rule[1] === b) || (rule[0] === b && rule[1] === a)
      );

      if (rule[0] === a) {
        return -1;
      }

      if (rule[1] === a) {
        return 1;
      }

      return 0;
    });

    total += row[Math.floor(row.length / 2)];
  }

  console.log("total part 2 ::", total);
  console.timeEnd("part 2");
})();
