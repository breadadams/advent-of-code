import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const configs = puzzleInput.split("\n\n").map((prizeConfig) => {
  const [buttonA, buttonB, prize] = prizeConfig.split("\n");

  const [buttonAX, buttonAY] = buttonA
    .replace("Button A: X+", "")
    .replace("Y+", "")
    .split(", ")
    .map(Number);

  const [buttonBX, buttonBY] = buttonB
    .replace("Button B: X+", "")
    .replace("Y+", "")
    .split(", ")
    .map(Number);

  const [prizeX, prizeY] = prize
    .replace("Prize: X=", "")
    .replace("Y=", "")
    .split(", ")
    .map(Number);

  return {
    buttonA: { x: buttonAX, y: buttonAY },
    buttonB: { x: buttonBX, y: buttonBY },
    prize: { x: prizeX, y: prizeY },
  };
});

// Part 1
(() => {
  console.time("part 1");
  let tokensSpent = 0;

  for (const config of configs) {
    let lowestTokenCount: number = undefined;
    let currentTokenCount = 0;
    let x = 0;
    let y = 0;

    while (true) {
      if (x > config.prize.x || y > config.prize.y) {
        break;
      }

      x += config.buttonA.x;
      y += config.buttonA.y;
      currentTokenCount += 3;

      const remainingX = config.prize.x - x;
      const remainingY = config.prize.y - y;

      if (
        remainingX % config.buttonB.x === 0 &&
        remainingY % config.buttonB.y === 0 &&
        remainingX / config.buttonB.x === remainingY / config.buttonB.y
      ) {
        const buttonBCost = remainingX / config.buttonB.x;

        if (
          typeof lowestTokenCount === "undefined" ||
          buttonBCost + currentTokenCount < lowestTokenCount
        ) {
          lowestTokenCount = buttonBCost + currentTokenCount;
        }
      }
    }

    if (lowestTokenCount) {
      tokensSpent += lowestTokenCount;
    }
  }

  console.log("part 1 tokens spent ::", tokensSpent);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  let tokensSpent = 0;

  const EXTRA_DISTANCE = 10000000000000;

  for (const config of configs) {
    /*
     * [Cramer's Rule for a 2x2 system]
     *
     * a = a button presses
     * ax & ay = a button distances
     * b = b button presses
     * bx & by = b button distances
     * cx & cy = prize position
     *
     * (a*ax) + (b*bx) = cx
     * (a*ay) + (b*by) = cy
     *
     * a = (by*cx - bx*cy) / (ax*by - ay*bx)
     * b = (ax*cy - ay*cx) / (ax*by - ay*bx)
     */

    const prizeX = config.prize.x + EXTRA_DISTANCE;
    const prizeY = config.prize.y + EXTRA_DISTANCE;

    const divisor =
      config.buttonA.x * config.buttonB.y - config.buttonA.y * config.buttonB.x;

    const aPresses =
      (config.buttonB.y * prizeX - config.buttonB.x * prizeY) / divisor;

    const bPresses =
      (config.buttonA.x * prizeY - config.buttonA.y * prizeX) / divisor;

    if (
      Math.floor(aPresses) === aPresses &&
      Math.floor(bPresses) === bPresses
    ) {
      tokensSpent += aPresses * 3 + bPresses;
    }
  }

  console.log("part 2 tokens spent ::", tokensSpent);
  console.timeEnd("part 2");
})();
