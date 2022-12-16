import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

type Point = { x: number; y: number };

const getDistance = (a: Point, b: Point) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const steps = puzzleInput.split("\n").map((line) => {
  const pattern =
    /Sensor at x=(?<sensorX>.*?), y=(?<sensorY>.*?): closest beacon is at x=(?<beaconX>.*?), y=(?<beaconY>.*?)\./im;

  const { sensorX, sensorY, beaconX, beaconY } = `${line}.`.match(pattern)
    ?.groups!!;

  const sensor = { x: parseInt(sensorX), y: parseInt(sensorY) } as Point;
  const beacon = { x: parseInt(beaconX), y: parseInt(beaconY) } as Point;
  const coverage = getDistance(sensor, beacon);

  return { sensor, beacon, coverage };
});

const getNonBeaconSpaces = (y: number) => {
  const occupiedSpaces = new Set<number>();

  for (const step of steps) {
    const { beacon, sensor, coverage } = step;

    if (beacon.y === y) {
      occupiedSpaces.add(beacon.x);
    }

    const distance = getDistance(sensor, { x: sensor.x, y });

    if (coverage >= distance) {
      const delta = coverage - distance;
      const start = sensor.x - delta;
      const end = sensor.x + delta;

      for (let i = start; i < end; i++) {
        occupiedSpaces.add(i);
      }
    }
  }

  return occupiedSpaces.size;
};

console.log("part 1", getNonBeaconSpaces(2000000));

type Range = [number, number];

const getTuningFrequency = (max: number) => {
  for (let y = 0; y < max; y++) {
    const ranges: Range[] = [];

    for (const step of steps) {
      const { sensor, coverage } = step;

      const distance = getDistance(sensor, { x: sensor.x, y });

      if (coverage >= distance) {
        const delta = coverage - distance;
        const start = sensor.x - delta;
        const end = sensor.x + delta;

        ranges.push([start, end]);
      }
    }

    ranges.sort((start, end) => start[0] - end[0]);

    for (let i = 1; i < ranges.length; i++) {
      const prevRange = ranges[i - 1];
      const range = ranges[i];

      if (prevRange[1] >= range[0]) {
        prevRange[1] = Math.max(prevRange[1], range[1]);
        ranges.splice(i, 1);
        i--;
      }
    }

    const matches: Range[] = [];

    for (const range of ranges) {
      if (
        (range[0] > 0 && range[0] < max) ||
        (range[1] > 0 && range[1] < max)
      ) {
        const start = Math.max(0, range[0]);
        const end = Math.min(range[1], max);

        matches.push([start, end]);
      }
    }

    if (matches.length) {
      if (matches[1][0] - matches[0][1] > 1) {
        return (matches[0][1] + 1) * 4000000 + y;
      }
    }
  }
};

console.log("part 2", getTuningFrequency(4000000));
