import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const getMonkeyConfig = (puzzle: string) =>
  puzzle.split("\n\n").map((textBlock) => {
    const lines = textBlock.split("\n").map((t) => t.trim());

    const startingItems = lines[1]
      .replace("Starting items: ", "")
      .split(", ")
      .map((s) => parseInt(s));

    const [operator, operationValueStr] = lines[2]
      .replace("Operation: new = old ", "")
      .split(" ");

    const testDivisor = parseInt(lines[3].replace("Test: divisible by ", ""));
    const testTrueIndex = parseInt(
      lines[4].replace("If true: throw to monkey ", "")
    );
    const testFalseIndex = parseInt(
      lines[5].replace("If false: throw to monkey ", "")
    );

    return {
      operation: (v: number) => {
        const operationValue =
          operationValueStr === "old" ? v : parseInt(operationValueStr);

        if (operator === "*") {
          return v * operationValue;
        }

        return v + operationValue;
      },
      startingItems,
      test: (v: number) =>
        v % testDivisor === 0 ? testTrueIndex : testFalseIndex,
      testDivisor,
    };
  });

const calculateMonkeyBusiness = (inspections: number[]) => {
  const sortedInspections = [...inspections].sort((a, b) => {
    if (a < b) {
      return 1;
    }

    if (a > b) {
      return -1;
    }

    return 0;
  });

  return sortedInspections[0] * sortedInspections[1];
};

// Part 1
(() => {
  const config = getMonkeyConfig(puzzleInput);
  const monkeyItems = config.map((c) => c.startingItems);
  const monkeyInspections = config.map(() => 0);
  const ROUND_LIMIT = 20;

  for (let round = 0; round < ROUND_LIMIT; round++) {
    for (let monkey = 0; monkey < config.length; monkey++) {
      const items = monkeyItems[monkey];
      const { test, operation } = config[monkey];

      for (let i = 0; i < items.length; i++) {
        const worryLevel = items[i];

        const newWorrylevel = Math.floor(operation(worryLevel) / 3);
        const nextMonkeyIndex = test(newWorrylevel);

        monkeyItems[nextMonkeyIndex].push(newWorrylevel);
      }

      monkeyInspections[monkey] += items.length;
      monkeyItems[monkey] = [];
      // console.log(`m_${monkey} - ${monkeyInspections}`);
    }
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeyInspections);

  console.log("part 1", monkeyBusiness);
})();

// Part 2
(() => {
  const config = getMonkeyConfig(puzzleInput);

  const monkeyModulus = config.reduce(
    (acc, { testDivisor }) => acc * testDivisor,
    1
  );

  const monkeyItems = config.map((c) => c.startingItems);
  const monkeyInspections = config.map(() => 0);
  const ROUND_LIMIT = 10_000;

  for (let round = 0; round < ROUND_LIMIT; round++) {
    for (let monkey = 0; monkey < config.length; monkey++) {
      const items = monkeyItems[monkey];
      const { test, operation } = config[monkey];

      for (let i = 0; i < items.length; i++) {
        const worryLevel = items[i];

        const newWorrylevel = operation(worryLevel) % monkeyModulus;
        const nextMonkeyIndex = test(newWorrylevel);

        monkeyItems[nextMonkeyIndex].push(newWorrylevel);
      }

      monkeyInspections[monkey] += items.length;
      monkeyItems[monkey] = [];
    }
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeyInspections);

  console.log("part 2", monkeyBusiness);
})();
