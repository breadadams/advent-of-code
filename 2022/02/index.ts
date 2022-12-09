import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const rounds = puzzleInput.split("\n");

const ROCK = "ROCK";
const PAPER = "PAPER";
const SCISSORS = "SCISSORS";

const SHAPE_SCORE = {
  [ROCK]: 1,
  [PAPER]: 2,
  [SCISSORS]: 3,
} as const;

const SHAPE = {
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS,
} as const;

const OPONENT_SHAPE = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
} as const;

type OponentShapeKey = keyof typeof OPONENT_SHAPE;
type OponentShapeValue = typeof OPONENT_SHAPE[OponentShapeKey];

type ShapeKey = keyof typeof SHAPE;
type ShapeValue = typeof SHAPE[ShapeKey];

const getOutcomeScore = (
  oponentShape: OponentShapeValue,
  shape: ShapeValue
): number => {
  if (
    (oponentShape === ROCK && shape === PAPER) ||
    (oponentShape === PAPER && shape === SCISSORS) ||
    (oponentShape === SCISSORS && shape === ROCK)
  ) {
    return 6;
  }

  if (oponentShape === shape) {
    return 3;
  }

  return 0;
};

const totalScore = rounds.reduce((score, round) => {
  const roundParts = round.split(" ");

  const oponentShapeKey = roundParts[0] as OponentShapeKey;
  const shapeKey = roundParts[1] as ShapeKey;

  const oponentShape = OPONENT_SHAPE[oponentShapeKey];
  const shape = SHAPE[shapeKey];

  const shapeScore = SHAPE_SCORE[shape];
  const outcomeScore = getOutcomeScore(oponentShape, shape);

  return score + shapeScore + outcomeScore;
}, 0);

console.log("part 1", totalScore);

// Part 2

const WIN = "WIN";
const DRAW = "DRAW";
const LOSS = "LOSS";

const NECESSARY_OUTCOME = {
  X: LOSS,
  Y: DRAW,
  Z: WIN,
} as const;

type NecessaryOutcomeKey = keyof typeof NECESSARY_OUTCOME;
type NecessaryOutcomeValue = typeof NECESSARY_OUTCOME[NecessaryOutcomeKey];

const getShapeForOutcome = (
  oponentShape: OponentShapeValue,
  necessaryOutcome: NecessaryOutcomeValue
): typeof SHAPE[ShapeKey] => {
  if (necessaryOutcome === WIN) {
    switch (oponentShape) {
      case ROCK:
        return PAPER;
      case PAPER:
        return SCISSORS;
      case SCISSORS:
        return ROCK;
    }
  }

  if (necessaryOutcome === LOSS) {
    switch (oponentShape) {
      case ROCK:
        return SCISSORS;
      case PAPER:
        return ROCK;
      case SCISSORS:
        return PAPER;
    }
  }

  // Draw
  return oponentShape;
};

const part2Score = rounds.reduce((score, round) => {
  const roundParts = round.split(" ");

  const oponentShapeKey = roundParts[0] as OponentShapeKey;
  const necessaryOutcomeKey = roundParts[1] as NecessaryOutcomeKey;

  const oponentShape = OPONENT_SHAPE[oponentShapeKey];
  const necessaryOutcome = NECESSARY_OUTCOME[necessaryOutcomeKey];

  const shapeForOutcome = getShapeForOutcome(oponentShape, necessaryOutcome);

  const shapeScore = SHAPE_SCORE[shapeForOutcome];
  const outcomeScore = getOutcomeScore(oponentShape, shapeForOutcome);

  return score + shapeScore + outcomeScore;
}, 0);

console.log("part 2", part2Score);
