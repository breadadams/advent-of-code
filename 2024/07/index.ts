import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const equations = puzzleInput.split("\n").map((row) => {
  const [testValue, numbers] = row.split(": ");

  return {
    testValue: parseInt(testValue),
    numbers: numbers.split(" ").map((n) => parseInt(n)),
  };
});

// Part 1
(() => {
  console.time("part 1");
  let total = 0;

  const compare = ({ numbers, testValue }: (typeof equations)[number]) => {
    if (numbers.length === 1) {
      return testValue === numbers[0];
    }

    const [current, next, ...rest] = numbers;

    if (current > testValue) {
      return false;
    }

    const multiply = current * next;
    const sum = current + next;

    if (multiply > testValue && sum > testValue) {
      return false;
    }

    return (
      compare({ numbers: [multiply, ...rest], testValue }) ||
      compare({ numbers: [sum, ...rest], testValue })
    );
  };

  for (let i = 0; i < equations.length; i++) {
    const equation = equations[i];

    if (compare(equation)) {
      total += equation.testValue;
    }
  }

  console.log("part 1 total ::", total);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  let total = 0;

  const compare = ({ numbers, testValue }: (typeof equations)[number]) => {
    if (numbers.length === 1) {
      return testValue === numbers[0];
    }

    const [current, next, ...rest] = numbers;

    if (current > testValue) {
      return false;
    }

    const multiply = current * next;
    const sum = current + next;
    const concat = Number(`${current}${next}`);

    return (
      (multiply <= testValue &&
        compare({ numbers: [multiply, ...rest], testValue })) ||
      (sum <= testValue && compare({ numbers: [sum, ...rest], testValue })) ||
      (concat <= testValue &&
        compare({ numbers: [concat, ...rest], testValue }))
    );
  };

  for (let i = 0; i < equations.length; i++) {
    const equation = equations[i];

    if (compare(equation)) {
      total += equation.testValue;
    }
  }

  console.log("part 2 total ::", total);
  console.timeEnd("part 2");
})();
