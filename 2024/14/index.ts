import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const robots = puzzleInput.split("\n").map((line) => {
  const [initialPosition, velocity] = line
    .replace("p=", "")
    .replace("v=", "")
    .split(" ")
    .map((c) => c.split(",").map(Number));

  return {
    position: { x: initialPosition[0], y: initialPosition[1] },
    velocity: { x: velocity[0], y: velocity[1] },
  };
});

const WIDTH = 101;
const HEIGHT = 103;

const printRobots = (robotData: typeof robots) => {
  const robotMap: string[][] = [...Array(HEIGHT).keys()].map(() => []);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const matches = robotData.filter(
        (robot) => robot.position.x === x && robot.position.y === y
      );

      robotMap[y][x] = `${matches.length || "."}`;
    }
  }

  console.log(robotMap.map((row) => row.join("")).join("\n"));
};

// Part 1
(() => {
  console.time("part 1");
  const TOTAL_SECONDS = 100;

  for (let i = 0; i < TOTAL_SECONDS; i++) {
    for (const robot of robots) {
      const newXPos = (robot.position.x + robot.velocity.x) % WIDTH;
      robot.position.x = newXPos >= 0 ? newXPos : WIDTH + newXPos;

      const newYPos = (robot.position.y + robot.velocity.y) % HEIGHT;
      robot.position.y = newYPos >= 0 ? newYPos : HEIGHT + newYPos;
    }
  }

  const middleX = Math.floor(WIDTH / 2);
  const middleY = Math.floor(HEIGHT / 2);

  const topLeftQuadrant = robots.filter(
    (robot) => robot.position.x < middleX && robot.position.y < middleY
  ).length;

  const topRightQuadrant = robots.filter(
    (robot) => robot.position.x > middleX && robot.position.y < middleY
  ).length;

  const bottomRightQuadrant = robots.filter(
    (robot) => robot.position.x > middleX && robot.position.y > middleY
  ).length;

  const bottomLeftQuadrant = robots.filter(
    (robot) => robot.position.x < middleX && robot.position.y > middleY
  ).length;

  const safetyFactor =
    topLeftQuadrant *
    topRightQuadrant *
    bottomRightQuadrant *
    bottomLeftQuadrant;

  console.log("part 1 safety factor ::", safetyFactor);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  let seconds = 0;

  while (true) {
    seconds++;
    for (const robot of robots) {
      const newXPos = (robot.position.x + robot.velocity.x) % WIDTH;
      robot.position.x = newXPos >= 0 ? newXPos : WIDTH + newXPos;

      const newYPos = (robot.position.y + robot.velocity.y) % HEIGHT;
      robot.position.y = newYPos >= 0 ? newYPos : HEIGHT + newYPos;
    }

    const robotPositions = new Set(
      robots.map((robot) => `${robot.position.x},${robot.position.y}`)
    );

    if (robotPositions.size === robots.length) {
      printRobots(robots);
      break;
    }
  }

  console.log("part 2 seconds for tree ::", seconds);
  console.timeEnd("part 2");
})();
