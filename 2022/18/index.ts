import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

type Droplet = { x: number; y: number; z: number };

const droplets: Droplet[] = puzzleInput.split("\n").map((line) => {
  const [x, y, z] = line.split(",").map((n) => parseInt(n));

  return { x, y, z };
});

const getDropletKey = (droplet: Droplet) =>
  `${droplet.x},${droplet.y},${droplet.z}`;

const dropletKeys = new Set(droplets.map((d) => getDropletKey(d)));

const getAdjacentDroplets = ({ x, y, z }: Droplet): Droplet[] => [
  { x: x - 1, y, z }, // Left
  { x: x + 1, y, z }, // Right
  { x, y: y - 1, z }, // Bottom
  { x, y: y + 1, z }, // Top
  { x, y, z: z - 1 }, // Back
  { x, y, z: z + 1 }, // Front
];

// Part 1
(() => {
  let visibleSides = 0;

  for (const droplet of droplets) {
    visibleSides += getAdjacentDroplets(droplet)
      .map(getDropletKey)
      .reduce((acc, key) => (!dropletKeys.has(key) ? acc + 1 : acc), 0);
  }

  console.log("part 1", visibleSides);
})();

// Part 2
(() => {
  const queue: Droplet[] = [{ x: 0, y: 0, z: 0 }];
  const visitedKeys = new Set();
  let visibleSides = 0;

  const min =
    Math.min(...droplets.map((d) => Math.min(...[d.x, d.y, d.z]))) - 1;
  const max =
    Math.max(...droplets.map((d) => Math.max(...[d.x, d.y, d.z]))) + 1;

  while (queue.length) {
    const droplet = queue.shift()!;
    const key = getDropletKey(droplet);

    if (
      !dropletKeys.has(key) &&
      !visitedKeys.has(key) &&
      droplet.x >= min &&
      droplet.y >= min &&
      droplet.z >= min &&
      droplet.x <= max &&
      droplet.y <= max &&
      droplet.z <= max
    ) {
      visitedKeys.add(key);

      const adjacentCubes = getAdjacentDroplets(droplet);

      visibleSides += adjacentCubes
        .map(getDropletKey)
        .reduce((acc, key) => (dropletKeys.has(key) ? acc + 1 : acc), 0);

      for (const cube of adjacentCubes) {
        queue.push(cube);
      }
    }
  }

  console.log("part 2", visibleSides);
})();
