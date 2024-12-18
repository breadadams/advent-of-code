import { expect, describe, test } from "bun:test";
import { part1, part2 } from ".";
import { getInputs } from "../../utils/get-inputs";

const { exampleInput, puzzleInput } = await getInputs("2024/18");

describe("part 1", () => {
  test("example", () => {
    expect(part1(exampleInput, 6, 12)).toBe(22);
  });

  test("puzzle", () => {
    expect(part1(puzzleInput, 70, 1024)).toBe(364);
  });
});

describe("part 2", () => {
  test("example", () => {
    expect(part2(exampleInput, 6, 12)).toBe("6,1");
  });
  test("puzzle", () => {
    expect(part2(puzzleInput, 70, 1024)).toBe("52,28");
  });
});
