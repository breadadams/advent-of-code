import { timePart1, timePart2 } from "../../utils/time-part";

const parseInput = (input: string) =>
  input.split("\n").map((row) => row.split(""));

const measureMap = (map: ReturnType<typeof parseInput>) => {
  const WIDTH = map[0].length;
  const HEIGHT = map.length;

  return { WIDTH, HEIGHT };
};

export const part1 = timePart1((input: string) => {
  const map = parseInput(input);
  const { HEIGHT, WIDTH } = measureMap(map);
  const antennas = new Map<string, Set<string>>();

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cell = map[y][x];

      if (cell === ".") {
        continue;
      }

      if (antennas.has(cell)) {
        antennas.get(cell)!.add(`${x},${y}`);
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

  return antinodes.size;
});

export const part2 = timePart2((input: string) => {
  const map = parseInput(input);
  const { HEIGHT, WIDTH } = measureMap(map);
  const antennas = new Map<string, Set<string>>();

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cell = map[y][x];

      if (cell === ".") {
        continue;
      }

      if (antennas.has(cell)) {
        antennas.get(cell)!.add(`${x},${y}`);
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

  return antinodes.size;
});
