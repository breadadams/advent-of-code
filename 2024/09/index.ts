import { timePart1, timePart2 } from "../../utils/time-part";

const parseInput = (input: string) => input.split("");

// Part 1
export const part1 = timePart1((input: string) => {
  const diskMap = parseInput(input);
  let representation = "";

  for (let i = 0; i < diskMap.length; i++) {
    const entry = Number(diskMap[i]);
    const isFile = i % 2 === 0;

    for (let j = 0; j < entry; j++) {
      representation += `${isFile ? i / 2 : "."}_`;
    }
  }

  let representationArr = representation
    .split("_")
    .filter((e) => e !== "")
    .map((e) => (e === "." ? e : Number(e)));

  let firstFreeSpaceBlockIndex = representationArr.indexOf(".");
  let lastFileBlockIndex = representationArr.findLastIndex((e) => e !== ".");

  while (lastFileBlockIndex > firstFreeSpaceBlockIndex) {
    const lastEntry = representationArr.pop()!;

    if (lastEntry !== ".") {
      representationArr[firstFreeSpaceBlockIndex] = lastEntry;
    }

    firstFreeSpaceBlockIndex = representationArr.indexOf(".");
    lastFileBlockIndex = representationArr.findLastIndex((e) => e !== ".");

    if (firstFreeSpaceBlockIndex === -1) {
      break;
    }
  }

  let checksum = 0;

  for (let i = 0; i < representationArr.length; i++) {
    const block = representationArr[i];

    if (block !== ".") {
      checksum += block * i;
    }
  }

  return checksum;
});

export const part2 = timePart2((input: string) => {
  const diskMap = parseInput(input);
  let representation = "";

  for (let i = 0; i < diskMap.length; i++) {
    const entry = Number(diskMap[i]);
    const isFile = i % 2 === 0;

    for (let j = 0; j < entry; j++) {
      representation += `${isFile ? i / 2 : "."}_`;
    }
  }

  let representationArr = representation
    .split("_")
    .filter((e) => e !== "")
    .map((e) => (e === "." ? e : Number(e)));

  const checkedNumbers = new Set<number>();

  let i = representationArr.length;

  while (true) {
    i = i - 1;

    if (i <= 0) {
      break;
    }

    const num = representationArr[i];

    if (num === "." || checkedNumbers.has(num)) {
      continue;
    }

    checkedNumbers.add(num);

    if (num === 0) {
      break;
    }

    let fileSize = 1;
    let j = i;

    while (true) {
      j = j - 1;
      if (representationArr[j] === num) {
        fileSize++;
      } else {
        break;
      }
    }

    const availableSpace = representationArr.findIndex((entry, i, arr) => {
      if (entry === ".") {
        let match = true;

        for (let k = 0; k < fileSize; k++) {
          if (arr[i + k] !== ".") {
            match = false;
          }
        }

        return match;
      }

      return false;
    });

    if (availableSpace === -1 || availableSpace > j) {
      continue;
    }

    for (let k = 0; k < fileSize; k++) {
      representationArr[availableSpace + k] = num;

      representationArr[j + 1 + k] = ".";
    }
  }

  let checksum = 0;

  for (let i = 0; i < representationArr.length; i++) {
    const block = representationArr[i];

    if (block !== ".") {
      checksum += block * i;
    }
  }

  return checksum;
});
