import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

enum Direction {
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
  LEFT = "L",
}

const steps = puzzleInput.split("\n").map((l) => {
  const [direction, distance] = l.split(" ");

  return { direction: direction as Direction, distance: Number(distance) };
});

interface Point {
  x: number;
  y: number;
}

const movePoint = (point: Point, direction: Direction) => {
  switch (direction) {
    case Direction.UP:
      point.y += 1;
      break;

    case Direction.RIGHT:
      point.x += 1;
      break;

    case Direction.DOWN:
      point.y -= 1;
      break;

    case Direction.LEFT:
      point.x -= 1;
      break;
  }
};

const followPoint = (pointToFollow: Point, point: Point) => {
  const totalDistance = Math.max(
    Math.abs(point.x - pointToFollow.x),
    Math.abs(point.y - pointToFollow.y)
  );

  if (totalDistance > 1) {
    const distanceX = pointToFollow.x - point.x;
    const distanceY = pointToFollow.y - point.y;

    point.x += Math.sign(distanceX);
    point.y += Math.sign(distanceY);
  }
};

// Part 1
const head = { x: 0, y: 0 };
const tail = { x: 0, y: 0 };
const tailPositions = new Set();

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];

  for (let j = 0; j < step.distance; j++) {
    movePoint(head, step.direction);
    followPoint(head, tail);

    tailPositions.add(`${tail.x},${tail.y}`);
  }
}

console.log("part 1", tailPositions.size);

// Part 2
const points: Point[] = [...Array(10).keys()].map(() => ({ x: 0, y: 0 }));
const part2TailPositions = new Set();

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];

  for (let j = 0; j < step.distance; j++) {
    movePoint(points[0], step.direction);

    for (let k = 1; k < points.length; k++) {
      const point = points[k];
      const prevPoint = points[k - 1];

      followPoint(prevPoint, point);
    }

    const lastPoint = points[points.length - 1];
    part2TailPositions.add(`${lastPoint.x},${lastPoint.y}`);
  }
}

console.log("part 2", part2TailPositions.size);
