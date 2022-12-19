import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const jetPatterns = puzzleInput.split("") as Array<"<" | ">">;

type PointKey = `${number},${number}`;
type Point = { x: number; y: number };
type RockShape = Point[];

const getPointKey = (point: Point): PointKey => `${point.x},${point.y}`;

/**
 * ####
 */
const ROCK_SHAPE_1: RockShape = [
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 4, y: 0 },
  { x: 5, y: 0 },
];

/**
 * .#.
 * ###
 * .#.
 */
const ROCK_SHAPE_2: RockShape = [
  { x: 3, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 3, y: 0 },
];

/**
 * ..#
 * ..#
 * ###
 */
const ROCK_SHAPE_3: RockShape = [
  { x: 4, y: 2 },
  { x: 4, y: 1 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 4, y: 0 },
];

/**
 * #
 * #
 * #
 * #
 */
const ROCK_SHAPE_4: RockShape = [
  { x: 2, y: 3 },
  { x: 2, y: 2 },
  { x: 2, y: 1 },
  { x: 2, y: 0 },
];

/**
 * ##
 * ##
 */
const ROCK_SHAPE_5: RockShape = [
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
];

const rockShapes = [
  ROCK_SHAPE_1,
  ROCK_SHAPE_2,
  ROCK_SHAPE_3,
  ROCK_SHAPE_4,
  ROCK_SHAPE_5,
];

const moveRock = (
  rock: RockShape,
  direction: "up" | "down" | "left" | "right",
  amount: number = 1
): RockShape => {
  const moved = rock.map((point) => {
    if (direction === "right") {
      return { ...point, x: point.x + amount };
    }

    if (direction === "left") {
      return { ...point, x: point.x - amount };
    }

    if (direction === "up") {
      return { ...point, y: point.y + amount };
    }

    // Down
    return { ...point, y: point.y - amount };
  });

  return moved;
};

const getHighestPoint = (points: RockShape) =>
  Math.max(...points.map((point) => point.y));

let jetPatternCount = 0;
const getJetPattern = () => {
  const jetPattern = jetPatterns[jetPatternCount];

  if (jetPatternCount < jetPatterns.length - 1) {
    jetPatternCount++;
  } else {
    jetPatternCount = 0;
  }

  return jetPattern === "<" ? "left" : "right";
};

const getChamberHeight = (rockCount: number) => {
  jetPatternCount = 0;
  const CHAMBER_WIDTH = 7;
  const settledRockPoints = new Set<PointKey>();

  let settledRocks = 0;
  let activeRock: RockShape | null = null;
  let highestPoint = 0;

  while (settledRocks < rockCount) {
    // Bring rock into chamber
    if (!activeRock) {
      activeRock = moveRock(
        [...rockShapes[settledRocks % rockShapes.length]],
        "up",
        highestPoint + 3
      );
    }

    // Move rock left or right
    const jetPattern = getJetPattern();
    const movedRock = moveRock(activeRock, jetPattern);

    const canMoveHorizontally = movedRock.every((point) => {
      const isWithinWalls =
        jetPattern === "left" ? point.x >= 0 : point.x < CHAMBER_WIDTH;

      return isWithinWalls && !settledRockPoints.has(getPointKey(point));
    });

    if (canMoveHorizontally) {
      activeRock = movedRock;
    }

    // Move down or settle
    const movedDownRock = moveRock(activeRock, "down");

    const canMoveDown = movedDownRock.every(
      (point) => point.y >= 0 && !settledRockPoints.has(getPointKey(point))
    );

    if (canMoveDown) {
      activeRock = movedDownRock;
    } else {
      for (const point of activeRock) {
        settledRockPoints.add(getPointKey(point));
      }

      highestPoint = Math.max(highestPoint, getHighestPoint(activeRock) + 1);
      settledRocks++;
      activeRock = null;
    }
  }

  return highestPoint;
};

console.log("part 1", getChamberHeight(2022));

// @todo: part 2
