import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

console.time("part 1");

type Dependencies = [string, string];
type DependencyValues = [number, number];
type Operator = "+" | "-" | "*" | "/";

enum MonkeyType {
  Number = "number",
  Operation = "operation",
}

type NumberMonkey = {
  name: string;
  type: MonkeyType.Number;
  value: number;
};

type OperationMonkey = {
  name: string;
  dependencies: Dependencies;
  operator: Operator;
  type: MonkeyType.Operation;
};

type MonkeyList = (NumberMonkey | OperationMonkey)[];

const ROOT = "root";
const HUMAN = "humn";

const monkeyArr: MonkeyList = puzzleInput.split("\n").map((line) => {
  const [name, task] = line.split(": ");

  const taskParts = task.split(" ");

  if (taskParts.length === 1) {
    return {
      name,
      type: MonkeyType.Number,
      value: parseInt(taskParts[0]),
    };
  }

  const [monkeyA, operator, monkeyB] = taskParts;

  return {
    name,
    dependencies: [monkeyA, monkeyB],
    operator: operator as Operator,
    type: MonkeyType.Operation,
  };
});

const monkeys = new Map(monkeyArr.map((m) => [m.name, m]));

const knownValues = new Map(
  monkeyArr
    .filter((m): m is NumberMonkey => m.type === MonkeyType.Number)
    .map((m) => [m.name, m.value])
);

const root = monkeys.get(ROOT) as OperationMonkey;

const hasKnownValues = (keys: Dependencies) =>
  keys.every((key) => knownValues.has(key));

const getKnownValues = (keys: Dependencies) =>
  keys.map((key) => knownValues.get(key)) as DependencyValues;

const performOperation = (a: number, b: number, operator: Operator): number => {
  if (operator === "*") return a * b;
  if (operator === "/") return a / b;
  if (operator === "+") return a + b;
  if (operator === "-") return a - b;

  return undefined as never;
};

const operationMonkeys = monkeyArr.filter(
  (m): m is OperationMonkey =>
    m.type === MonkeyType.Operation && m.name !== ROOT
);

while (!hasKnownValues(root.dependencies)) {
  for (const monkey of operationMonkeys) {
    if (hasKnownValues(monkey.dependencies)) {
      knownValues.set(
        monkey.name,
        performOperation(
          ...getKnownValues(monkey.dependencies),
          monkey.operator
        )
      );

      operationMonkeys.splice(operationMonkeys.indexOf(monkey), 1);
    }
  }
}

console.log(
  "part 1",
  performOperation(...getKnownValues(root.dependencies), root.operator)
);
console.timeEnd("part 1");

console.time("part 2");

// Part 2
const findPathToRoot = (name: string, path: string[] = []): string[] => {
  const nextPath = [...path, name];
  const dependent = monkeyArr.find(
    (m): m is OperationMonkey =>
      m.type === MonkeyType.Operation && m.dependencies.includes(name)
  );

  if (!dependent) return nextPath;

  return findPathToRoot(dependent.name, nextPath);
};

const pathToHuman = findPathToRoot(HUMAN).reverse();

const performInverseOperation = (
  a: number,
  b: number,
  operator: Operator,
  flip?: boolean
): number => {
  if (operator === "*") return a / b;
  if (operator === "/") return !flip ? a * b : b / a;
  if (operator === "+") return a - b;
  if (operator === "-") return !flip ? a + b : b - a;

  return undefined as never;
};

let humanValue = 0;

for (let i = 0; i < pathToHuman.length - 1; i++) {
  const name = pathToHuman[i];
  const nextName = pathToHuman[i + 1];

  const monkey = monkeys.get(name) as OperationMonkey;

  // The side of the operation that `x` is on, where `x` is the unknown value we're calculating.
  // 0 = left | 1 = right
  const unknownOperandSide = monkey.dependencies.indexOf(nextName) as 0 | 1;

  const otherOperand = knownValues.get(
    monkey.dependencies[unknownOperandSide === 0 ? 1 : 0]
  )!;

  if (monkey.name === ROOT) {
    humanValue = otherOperand;
  } else {
    humanValue = performInverseOperation(
      humanValue,
      otherOperand,
      monkey.operator,
      (monkey.operator === "-" || monkey.operator === "/") &&
        unknownOperandSide === 1
    );
  }
}

console.log("part 2", humanValue);
console.timeEnd("part 2");
