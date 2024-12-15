import { timePart1, timePart2 } from "../../utils/time-part";

const parseInput = (input: string) => {
  return input.split("\n").map((row) => {
    const [testValue, numbers] = row.split(": ");

    return {
      testValue: parseInt(testValue),
      numbers: numbers.split(" ").map((n) => parseInt(n)),
    };
  });
};

export const part1 = timePart1((input: string) => {
  let total = 0;
  const equations = parseInput(input);

  const compare = ({
    numbers,
    testValue,
  }: (typeof equations)[number]): boolean => {
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

  return total;
});

export const part2 = timePart2((input: string) => {
  let total = 0;
  const equations = parseInput(input);

  const compare = ({
    numbers,
    testValue,
  }: (typeof equations)[number]): boolean => {
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

  return total;
});
