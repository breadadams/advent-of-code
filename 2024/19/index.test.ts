import { expect, describe, test } from "bun:test";
import { part1, part2 } from ".";
import { getInputs } from "../../utils/get-inputs";

const { exampleInput, puzzleInput } = await getInputs("2024/19");

describe("part 1", () => {
  test("example", () => {
    expect(part1(exampleInput)).toBe(6);
  });

  test("puzzle", () => {
    expect(part1(puzzleInput)).toBe(358);
  });
});

describe("part 2", () => {
  test("example", () => {
    expect(part2(exampleInput)).toBe(16);
  });

  test("puzzle", () => {
    expect(part2(puzzleInput)).toBe(600639829400603);
  });
});
