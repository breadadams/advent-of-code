import { expect, describe, test } from "bun:test";
import { part1, part2 } from ".";
import { getInputs } from "../../utils/get-inputs";

const { exampleInput, puzzleInput } = await getInputs("2024/07");

describe("part 1", () => {
  test("example", () => {
    expect(part1(exampleInput)).toBe(3749);
  });

  test("puzzle", () => {
    expect(part1(puzzleInput)).toBe(3312271365652);
  });
});

describe("part 2", () => {
  test("example", () => {
    expect(part2(exampleInput)).toBe(11387);
  });

  test("puzzle", () => {
    expect(part2(puzzleInput)).toBe(509463489296712);
  });
});
