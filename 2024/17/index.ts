import { timePart1, timePart2 } from "../../utils/time-part";

const parseInput = (input: string) => {
  const [registers, program] = input.split("\n\n");

  const [a, b, c] = registers
    .split("\n")
    .map((register) => BigInt(register.split(": ")[1]));

  return {
    registers: { a, b, c },
    program: program.split(": ")[1].split(",").map(BigInt),
  };
};

const modulo = (a: bigint, b: bigint) => ((a % b) + b) % b;

const getComboOperand = (
  literalOperand: bigint,
  registers: ReturnType<typeof parseInput>["registers"]
) => {
  if (literalOperand === 4n) return registers.a;
  if (literalOperand === 5n) return registers.b;
  if (literalOperand === 6n) return registers.c;

  return literalOperand;
};

const runProgram = ({ program, registers }: ReturnType<typeof parseInput>) => {
  let output: bigint[] = [];

  let i = 0;
  while (true) {
    if (i >= program.length) {
      break;
    }

    const opcode = program[i];
    const operandIndex = i + 1;

    if (operandIndex >= program.length) {
      break;
    }

    const literalOperand = program[operandIndex];
    const comboOperand = getComboOperand(literalOperand, registers);

    // adv
    if (opcode === 0n) {
      registers.a = registers.a / 2n ** comboOperand;
    }

    // bxl
    if (opcode === 1n) {
      registers.b = registers.b ^ literalOperand;
    }

    // bst
    if (opcode === 2n) {
      registers.b = modulo(comboOperand, 8n);
    }

    // jnz
    if (opcode === 3n && registers.a !== 0n) {
      i = Number(literalOperand);
      continue;
    }

    // bxc
    if (opcode === 4n) {
      registers.b = registers.b ^ registers.c;
    }

    // out
    if (opcode === 5n) {
      output.push(modulo(comboOperand, 8n));
    }

    // bdv
    if (opcode === 6n) {
      registers.b = registers.a / 2n ** comboOperand;
    }

    // cdv
    if (opcode === 7n) {
      registers.c = registers.a / 2n ** comboOperand;
    }

    // Skip operand
    i += 2;
  }

  return output.join(",");
};

export const part1 = timePart1((input: string) => {
  const { program, registers } = parseInput(input);

  return runProgram({ program, registers });
});

export const part2 = timePart2((input: string) => {
  const { program, registers } = parseInput(input);

  const programStr = program.join(",");
  let a = 0n;

  while (true) {
    const output = runProgram({ program, registers: { ...registers, a } });

    if (output === programStr) {
      break;
    }

    // Once we _start_ to find a match
    if (programStr.indexOf(output) + output.length === programStr.length) {
      // Just increment in instances of 8-times the value of the `A` register
      a = 8n * a;

      continue;
    }

    a++;
  }

  return a.toString();
});
