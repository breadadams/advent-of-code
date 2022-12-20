import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

type File = Array<{ value: number; index: number }>;

const file: File = puzzleInput
  .split("\n")
  .map((n, index) => ({ value: parseInt(n), index }));

const reorderFile = (file: File, iterations = 1): File => {
  const copy = [...file];

  for (let i = 0; i < copy.length * iterations; i++) {
    const mappedIndex = copy.findIndex((f) => f.index === i % copy.length);
    const [entry] = copy.splice(mappedIndex, 1);

    const newPosition = (mappedIndex + entry.value) % copy.length;
    copy.splice(newPosition, 0, entry);
  }

  return copy;
};

const sumPostZeroIndexValues = (file: File, indices: number[]) => {
  const zeroIndex = file.findIndex((entry) => entry.value === 0);

  return indices
    .map((index) => file[(zeroIndex + index) % file.length].value)
    .reduce((acc, n) => acc + n, 0);
};

// Part 1
(() => {
  const decryptedFile = reorderFile(file);

  const sum = sumPostZeroIndexValues(decryptedFile, [1000, 2000, 3000]);

  console.log("part 1", sum);
})();

// Part 2
(() => {
  const decryptedFile = reorderFile(
    [...file].map((f) => ({ ...f, value: f.value * 811589153 })),
    10
  );

  const sum = sumPostZeroIndexValues(decryptedFile, [1000, 2000, 3000]);

  console.log("part 2", sum);
})();
