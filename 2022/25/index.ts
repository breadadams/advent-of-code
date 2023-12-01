import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

console.time("part 1");

const snafuNumbers = puzzleInput.split("\n").map((line) => line.split(""));

const getSnafuPlace = (n: number) => {
  let place = 1;

  for (let i = 0; i < n; i++) {
    place *= 5;
  }

  return place;
};

// console.log("getSnafuPlace", getSnafuPlace(2));

const snafuDigitToDecimal = (digit: string) => {
  if (digit === "2") return 2;
  if (digit === "1") return 1;
  if (digit === "0") return 0;
  if (digit === "-") return -1;
  if (digit === "=") return -2;

  return undefined as never;
};

const decimalValues = snafuNumbers.map((snafuNumber) =>
  snafuNumber.reduce(
    (acc, digit, i) =>
      acc +
      snafuDigitToDecimal(digit) * getSnafuPlace(snafuNumber.length - i - 1),
    0
  )
);

const decimalValuesSum = decimalValues.reduce((acc, n) => acc + n, 0);

// console.log("decimalValuesSum", decimalValuesSum);

const toSnafuDigit = (decimalValue: number) =>
  ({
    "-2": "=",
    "-1": "-",
    0: "0",
    1: "1",
    2: "2",
  }[decimalValue]);

const encodeSnafuNumber = (number: number) => {
  let numDigits = Math.ceil(Math.log(2 * number) / Math.log(5));
  console.log("numDigits", numDigits);
  console.log("Math.log(5)", Math.log(5));

  let snafuNumber = "";
  for (let i = numDigits - 1; i >= 0; i--) {
    let digitValue = Math.round(number / 5 ** i);
    number -= digitValue * 5 ** i;
    snafuNumber += toSnafuDigit(digitValue);
  }
  return snafuNumber;
};

console.log("encodeSnafuNumber", encodeSnafuNumber(4890));

console.timeEnd("part 1");

// @todo: try and solve this in the future
