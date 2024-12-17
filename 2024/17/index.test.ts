import { expect, describe, test } from "bun:test";
import { part1, part2 } from ".";
import { getInputs } from "../../utils/get-inputs";

const { exampleInput, puzzleInput } = await getInputs("2024/17");

describe("part 1", () => {
  test("example", () => {
    expect(part1(exampleInput)).toBe("4,6,3,5,6,3,5,2,1,0");
  });

  test("puzzle", () => {
    expect(part1(puzzleInput)).toBe("7,1,3,4,1,2,6,7,1");
  });
});

const exampleInputForPart2 = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`.trim();

describe("part 2", () => {
  test("example", () => {
    expect(part2(exampleInputForPart2)).toBe("117440");
  });

  test("puzzle", () => {
    expect(part2(puzzleInput)).toBe("109019476330651");
  });
});
