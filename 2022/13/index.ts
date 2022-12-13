import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

type Packet = number | Packet[];

const parsePacket = (str: string) => JSON.parse(str) as Packet[];

const packetPairs = puzzleInput
  .split("\n\n")
  .map((pair) => pair.split("\n").map(parsePacket));

const packetCompare = (packetA: Packet, packetB: Packet): number => {
  const isNumberA = typeof packetA === "number";
  const isNumberB = typeof packetB === "number";

  if (isNumberA && isNumberB) {
    return packetA - packetB;
  }

  const arrA = isNumberA ? [packetA] : packetA;
  const arrB = isNumberB ? [packetB] : packetB;

  const length = Math.min(arrA.length, arrB.length);

  for (let i = 0; i < length; i++) {
    const res = packetCompare(arrA[i], arrB[i]);

    if (res !== 0) {
      return res;
    }
  }

  return arrA.length - arrB.length;
};

const indexSum = packetPairs.reduce(
  (acc, pair, i) => acc + (packetCompare(pair[0], pair[1]) < 0 ? i + 1 : 0),
  0
);

console.log("part 1", indexSum);

// Part 2
const allPackets = puzzleInput
  .split("\n")
  .filter((line) => !!line)
  .map(parsePacket);

const dividerPacket2 = [[2]];
const dividerPacket6 = [[6]];

const dividerPackets = [dividerPacket2, dividerPacket6];

const sortedPackets = [...allPackets, ...dividerPackets].sort(packetCompare);

const dividerPacket2Index =
  sortedPackets.findIndex((p) => p === dividerPacket2) + 1;
const dividerPacket6Index =
  sortedPackets.findIndex((p) => p === dividerPacket6) + 1;

const decoderKey = dividerPacket2Index * dividerPacket6Index;

console.log("part 2", decoderKey);
