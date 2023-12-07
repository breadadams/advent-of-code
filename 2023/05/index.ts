import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n\n");

const seeds = lines[0]
  .split(": ")[1]
  .split(" ")
  .map((seed) => +seed);

const extractMap = (line: string) =>
  line
    .split(":")[1]
    .trim()
    .split("\n")
    .map((mapLine) => {
      const [destRangeStart, sourceRangeStart, rangeLength] = mapLine
        .split(" ")
        .map((v) => +v);

      const sourceRangeEnd = sourceRangeStart + rangeLength;

      const isWithinRange = (value: number) =>
        sourceRangeStart <= value && value <= sourceRangeEnd;

      const rangeDiff = destRangeStart - sourceRangeStart;

      return {
        destRangeStart,
        sourceRangeStart,
        rangeLength,
        rangeDiff,
        isWithinRange,
      };
    });

const seedToSoil = extractMap(lines[1]);

const soilToFertilizer = extractMap(lines[2]);

const fertilizerToWater = extractMap(lines[3]);

const waterToLight = extractMap(lines[4]);

const lightToTemperature = extractMap(lines[5]);

const temperatureToHumidity = extractMap(lines[6]);

const humidityToLocation = extractMap(lines[7]);

const getValueFromMap = (
  prevValue: number,
  mapArr: ReturnType<typeof extractMap>
) => {
  const map = mapArr.find((mapEntry) => mapEntry.isWithinRange(prevValue));

  return map ? map.rangeDiff + prevValue : prevValue;
};

// Part 1
(() => {
  console.log("=========");
  console.time("part 1");

  const locations: number[] = [];

  for (const seed of seeds) {
    const soil = getValueFromMap(seed, seedToSoil);

    const fertilizer = getValueFromMap(soil, soilToFertilizer);

    const water = getValueFromMap(fertilizer, fertilizerToWater);

    const light = getValueFromMap(water, waterToLight);

    const temperature = getValueFromMap(light, lightToTemperature);

    const humidity = getValueFromMap(temperature, temperatureToHumidity);

    const location = getValueFromMap(humidity, humidityToLocation);

    locations.push(location);
  }

  console.log("part 1 - lowest location:", Math.min(...locations));

  console.timeEnd("part 1");
})();
