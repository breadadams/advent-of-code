import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const findMarkerPosition = (markerLength: number) => {
  let marker = new Set();
  let position = 0;

  for (let i = 0; i < puzzleInput.length; i++) {
    if (!position) {
      const markerToTest = puzzleInput.substring(i, i + markerLength);

      marker = new Set([...markerToTest]);

      if (marker.size === markerLength) {
        position = i + markerLength;
      }
    }
  }

  return position;
};

const part1 = findMarkerPosition(4);
console.log(part1);

const part2 = findMarkerPosition(14);
console.log(part2);
