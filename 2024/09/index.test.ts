import { expect, describe, test } from "bun:test";
import { part1, part2 } from ".";
import { getInputs } from "../../utils/get-inputs";

const { exampleInput, puzzleInput } = await getInputs("2024/09");

describe("part 1", () => {
  test("example", () => {
    expect(part1(exampleInput)).toBe(1928);
  });

  test("puzzle", () => {
    expect(part1(puzzleInput)).toBe(6258319840548);
  });
});

describe("part 2", () => {
  test("example", () => {
    expect(part2(exampleInput)).toBe(2858);
  });

  test("puzzle", () => {
    expect(part2(puzzleInput)).toBe(6286182965311);
  });
});
