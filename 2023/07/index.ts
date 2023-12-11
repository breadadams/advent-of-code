import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");

const CARD_STRENGTH = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  "9": 8,
  "8": 7,
  "7": 6,
  "6": 5,
  "5": 4,
  "4": 3,
  "3": 2,
  "2": 1,
};

const HAND_STRENGTH = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIR: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1,
};

const hands = lines.map((line) => line.split(" ")[0]);

const bidMap = new Map(
  lines.map((line) => {
    const [hand, bid] = line.split(" ");

    return [hand, +bid];
  })
);

const hasSameValueNTimes = (
  array: string[],
  targetValue: string,
  n: number
) => {
  const count = array.filter((value) => value === targetValue).length;
  return count === n;
};

const hasNOfAKind = (handArr: string[], n: number) => {
  return handArr.some((card) => hasSameValueNTimes(handArr, card, n));
};

const countPairs = (handArr: string[]) => {
  const counts = {};

  for (const card of handArr) {
    counts[card] = (counts[card] ?? 0) + 1;
  }

  return Object.values(counts).filter((count) => count === 2).length;
};

const getHandScore = (hand: string) => {
  const handCards = hand.split("");

  const isFiveOfAKind = handCards.every((card) => card === handCards[0]);

  if (isFiveOfAKind) return HAND_STRENGTH.FIVE_OF_A_KIND;

  if (hasNOfAKind(handCards, 4)) {
    return HAND_STRENGTH.FOUR_OF_A_KIND;
  }

  if (hasNOfAKind(handCards, 3) && hasNOfAKind(handCards, 2)) {
    return HAND_STRENGTH.FULL_HOUSE;
  }

  if (hasNOfAKind(handCards, 3)) {
    return HAND_STRENGTH.THREE_OF_A_KIND;
  }

  const pairCount = countPairs(handCards);

  if (pairCount === 2) {
    return HAND_STRENGTH.TWO_PAIR;
  }

  if (pairCount === 1) {
    return HAND_STRENGTH.ONE_PAIR;
  }

  return HAND_STRENGTH.HIGH_CARD;
};

const compareHandsByCardStrength = (handA: string, handB: string) => {
  for (let i = 0; i < handA.length; i++) {
    const strengthA = CARD_STRENGTH[handA[i]];
    const strengthB = CARD_STRENGTH[handB[i]];

    if (strengthA > strengthB) {
      return 1;
    }

    if (strengthB > strengthA) {
      return -1;
    }
  }

  return 0;
};

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  let totalWinnings = 0;
  const sortedHands = [...hands];

  sortedHands.sort((handA, handB) => {
    const scoreA = getHandScore(handA);
    const scoreB = getHandScore(handB);

    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }

    return compareHandsByCardStrength(handA, handB);
  });

  for (const [i, hand] of sortedHands.entries()) {
    totalWinnings += (i + 1) * bidMap.get(hand);
  }

  console.log("part 1 - totalWinnings", totalWinnings);

  console.timeEnd("part 1");
})();
