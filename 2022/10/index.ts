import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const instructions = puzzleInput.split("\n");

// Part 1
(() => {
  let x = 1;
  let cycle = 0;
  const signalStrengths: number[] = [];

  const storeSignal = () => {
    if (cycle % 40 === 20 && cycle <= 220) {
      signalStrengths.push(cycle * x);
    }
  };

  for (const instruction of instructions) {
    if (instruction === "noop") {
      cycle++;
      storeSignal();
    } else if (instruction.startsWith("addx")) {
      const [, value] = instruction.split(" ");

      for (let i = 0; i < 2; i++) {
        cycle++;
        storeSignal();
      }

      x += Number(value);
    }
  }

  const signalStrengthsTotal = signalStrengths.reduce(
    (acc, strength) => acc + strength,
    0
  );

  console.log("part 1", signalStrengthsTotal);
})();

// Part 2
(() => {
  let x = 1;
  let cycle = 0;
  let crt = "";
  const rowLength = 40;

  const writeToCRT = () => {
    crt += [x - 1, x, x + 1].includes(cycle % rowLength) ? "#" : ".";

    if (cycle % rowLength === rowLength - 1) {
      crt += "\n";
    }
  };

  for (const instruction of instructions) {
    if (instruction === "noop") {
      writeToCRT();
      cycle++;
    } else if (instruction.startsWith("addx")) {
      const [, value] = instruction.split(" ");

      for (let i = 0; i < 2; i++) {
        writeToCRT();
        cycle++;
      }

      x += Number(value);
    }
  }

  console.log("part 2");
  console.log(crt);
})();
