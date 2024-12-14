import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

const map = puzzleInput.split("\n").map((row) => row.split(""));

const WIDTH = map[0].length;
const HEIGHT = map.length;

// Part 1
(() => {
  console.time("part 1");

  const antennas = new Map<string, Set<string>>();

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cell = map[y][x];

      if (cell === ".") {
        continue;
      }

      if (antennas.has(cell)) {
        antennas.get(cell).add(`${x},${y}`);
      } else {
        antennas.set(cell, new Set<string>([`${x},${y}`]));
      }
    }
  }

  const antinodes = new Set<string>();

  for (const antenna of antennas.values()) {
    const comparedPositions = new Set<string>();

    for (const currentCoord of antenna) {
      const [currentX, currentY] = currentCoord.split(",").map(Number);

      for (const otherCoord of antenna) {
        if (
          otherCoord !== currentCoord &&
          (!comparedPositions.has(`${currentCoord}_${otherCoord}`) ||
            !comparedPositions.has(`${otherCoord}_${currentCoord}`))
        ) {
          const [otherX, otherY] = otherCoord.split(",").map(Number);

          const diffX = Math.abs(currentX - otherX);
          const diffY = Math.abs(currentY - otherY);

          const currentAntinodeX =
            currentX < otherX ? currentX - diffX : currentX + diffX;
          const currentAntinodeY =
            currentY < otherY ? currentY - diffY : currentX + diffY;

          const otherAntinodeX =
            currentX < otherX ? otherX + diffX : otherX - diffX;
          const otherAntinodeY =
            currentY < otherY ? otherY + diffY : otherY + diffY;

          if (
            currentAntinodeX >= 0 &&
            currentAntinodeX < WIDTH &&
            currentAntinodeY >= 0 &&
            currentAntinodeY < HEIGHT
          ) {
            antinodes.add(`${currentAntinodeX},${currentAntinodeY}`);
          }

          if (
            otherAntinodeX >= 0 &&
            otherAntinodeX < WIDTH &&
            otherAntinodeY >= 0 &&
            otherAntinodeY < HEIGHT
          ) {
            antinodes.add(`${otherAntinodeX},${otherAntinodeY}`);
          }

          comparedPositions.add(`${currentCoord}_${otherCoord}`);
          comparedPositions.add(`${otherCoord}_${currentCoord}`);
        }
      }
    }
  }

  console.log("part 1 antinode count ::", antinodes.size);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");
  const antennas = new Map<string, Set<string>>();

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cell = map[y][x];

      if (cell === ".") {
        continue;
      }

      if (antennas.has(cell)) {
        antennas.get(cell).add(`${x},${y}`);
      } else {
        antennas.set(cell, new Set<string>([`${x},${y}`]));
      }
    }
  }

  const antinodes = new Set<string>();

  for (const antenna of antennas.values()) {
    const comparedPositions = new Set<string>();

    for (const currentCoord of antenna) {
      const [currentX, currentY] = currentCoord.split(",").map(Number);

      for (const otherCoord of antenna) {
        if (
          otherCoord !== currentCoord &&
          (!comparedPositions.has(`${currentCoord}_${otherCoord}`) ||
            !comparedPositions.has(`${otherCoord}_${currentCoord}`))
        ) {
          const [otherX, otherY] = otherCoord.split(",").map(Number);

          const diffX = Math.abs(currentX - otherX);
          const diffY = Math.abs(currentY - otherY);

          const currentAntinodeX =
            currentX < otherX ? currentX - diffX : currentX + diffX;
          const currentAntinodeY =
            currentY < otherY ? currentY - diffY : currentX + diffY;

          if (
            currentAntinodeX >= 0 &&
            currentAntinodeX < WIDTH &&
            currentAntinodeY >= 0 &&
            currentAntinodeY < HEIGHT
          ) {
            antinodes.add(`${currentAntinodeX},${currentAntinodeY}`);

            let newX = currentAntinodeX;
            let newY = currentAntinodeY;

            while (true) {
              newX = currentX < otherX ? newX - diffX : newX + diffX;
              newY = currentY < otherY ? newY - diffY : newY + diffY;

              if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
                antinodes.add(`${newX},${newY}`);
              } else {
                break;
              }
            }
          }

          const otherAntinodeX =
            currentX < otherX ? otherX + diffX : otherX - diffX;
          const otherAntinodeY =
            currentY < otherY ? otherY + diffY : otherY + diffY;

          if (
            otherAntinodeX >= 0 &&
            otherAntinodeX < WIDTH &&
            otherAntinodeY >= 0 &&
            otherAntinodeY < HEIGHT
          ) {
            antinodes.add(`${otherAntinodeX},${otherAntinodeY}`);

            let newX = otherAntinodeX;
            let newY = otherAntinodeY;

            while (true) {
              newX = currentX < otherX ? newX + diffX : newX - diffX;
              newY = currentY < otherY ? newY + diffY : newY - diffY;

              if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
                antinodes.add(`${newX},${newY}`);
              } else {
                break;
              }
            }
          }

          comparedPositions.add(`${currentCoord}_${otherCoord}`);
          comparedPositions.add(`${otherCoord}_${currentCoord}`);
        }
      }
    }
  }

  for (const [, antena] of antennas) {
    if (antena.size > 0) {
      for (const coord of antena) {
        antinodes.add(coord);
      }
    }
  }

  console.log("part 2 antinode count ::", antinodes.size);
  console.timeEnd("part 2");
})();
