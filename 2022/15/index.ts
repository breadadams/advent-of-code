import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

type Point = { x: number; y: number };

const steps = puzzleInput.split("\n").map((line) => {
  const pattern =
    /Sensor at x=(?<sensorX>.*?), y=(?<sensorY>.*?): closest beacon is at x=(?<beaconX>.*?), y=(?<beaconY>.*?)\./im;

  const { sensorX, sensorY, beaconX, beaconY } = `${line}.`.match(pattern)
    ?.groups!!;

  return {
    sensor: { x: parseInt(sensorX), y: parseInt(sensorY) } as Point,
    beacon: { x: parseInt(beaconX), y: parseInt(beaconY) } as Point,
  };
});

const getDistance = (a: Point, b: Point) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getNonBeaconSpaces = (y: number) => {
  const occupiedSpaces = new Set<number>();

  for (const step of steps) {
    if (step.beacon.y === y) {
      occupiedSpaces.add(step.beacon.x);
    }

    const range = getDistance(step.sensor, step.beacon);
    const distanceToY = getDistance(step.sensor, { x: step.sensor.x, y });

    if (range >= distanceToY) {
      const delta = range - distanceToY;
      const start = step.sensor.x - delta;
      const end = step.sensor.x + delta;

      for (let i = start; i < end; i++) {
        occupiedSpaces.add(i);
      }
    }
  }

  return occupiedSpaces.size;
};

console.log("part 1", getNonBeaconSpaces(2000000));
