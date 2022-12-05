import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

let crates = [
  ["V", "C", "D", "R", "Z", "G", "B", "W"],
  ["G", "W", "F", "C", "B", "S", "T", "V"],
  ["C", "B", "S", "N", "W"],
  ["Q", "G", "M", "N", "J", "V", "C", "P"],
  ["T", "S", "L", "F", "D", "H", "B"],
  ["J", "V", "T", "W", "M", "N"],
  ["P", "F", "L", "C", "S", "T", "G"],
  ["B", "D", "Z"],
  ["M", "N", "Z", "W"],
];

const steps = puzzleInput.split("\n");

// Part 1

for (let i = 0; i < steps.length; i++) {
  const [, amountStr, , originStr, , targetStr] = steps[i].split(" ");

  const amount = Number(amountStr);
  const origin = Number(originStr);
  const target = Number(targetStr);

  for (let i2 = 0; i2 < amount; i2++) {
    const removed = crates[origin - 1].pop() as string;
    crates[target - 1].push(removed);
  }
}

const topOfStacks = crates.map((stack) => stack[stack.length - 1]).join("");

console.log(topOfStacks);

// Part 2
let crates2 = [
  ["V", "C", "D", "R", "Z", "G", "B", "W"],
  ["G", "W", "F", "C", "B", "S", "T", "V"],
  ["C", "B", "S", "N", "W"],
  ["Q", "G", "M", "N", "J", "V", "C", "P"],
  ["T", "S", "L", "F", "D", "H", "B"],
  ["J", "V", "T", "W", "M", "N"],
  ["P", "F", "L", "C", "S", "T", "G"],
  ["B", "D", "Z"],
  ["M", "N", "Z", "W"],
];

for (let i = 0; i < steps.length; i++) {
  const [, amountStr, , originStr, , targetStr] = steps[i].split(" ");

  const amount = Number(amountStr);
  const origin = Number(originStr);
  const target = Number(targetStr);

  const toMove = crates2[origin - 1].splice(amount * -1, amount);

  crates2[target - 1] = [...crates2[target - 1], ...toMove];
}

const topOfStacks2 = crates2.map((stack) => stack[stack.length - 1]).join("");

console.log(topOfStacks2);
