import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const stones = puzzleInput.split(" ");

const blink = (
  stone: string,
  blinkCount: number,
  cache: Map<string, number>
) => {
  const nextBlinkCount = blinkCount - 1;

  if (nextBlinkCount >= 0) {
    const cacheKey = `${stone}.${blinkCount}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    if (stone === "0") {
      const res = blink("1", nextBlinkCount, cache);
      cache.set(cacheKey, res);
      return res;
    }

    if (stone.length % 2 === 0) {
      const center = stone.length / 2;

      const newStone1 = stone.substring(0, center);
      const newStone2 = `${Number(stone.substring(center, stone.length))}`;

      const res1 = blink(newStone1, nextBlinkCount, cache);
      const res2 = blink(newStone2, nextBlinkCount, cache);
      const res = res1 + res2;

      cache.set(cacheKey, res);
      return res;
    }

    const res = blink(`${Number(stone) * 2024}`, nextBlinkCount, cache);
    cache.set(cacheKey, res);

    return res;
  }

  return 1;
};

const countStones = (blinks: number) => {
  const cache = new Map<string, number>();
  let count = 0;

  for (const stone of stones) {
    count += blink(stone, blinks, cache);
  }

  return count;
};

// Part 1
(() => {
  console.time("part 1");
  const stoneCount = countStones(25);
  console.log("part 1 stoneCount >>>", stoneCount);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  const stoneCount = countStones(75);
  console.log("part 2 stoneCount >>>", stoneCount);
  console.timeEnd("part 2");
})();
