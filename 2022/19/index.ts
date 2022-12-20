import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const ORE = "ore";
const CLAY = "clay";
const OBSIDIAN = "obsidian";
const GEODE = "geode";

const blueprints = puzzleInput.split("\n").map((line) => {
  const pattern =
    /Blueprint (?<index>.*?): Each ore robot costs (?<oreRobotCost>.*?) ore. Each clay robot costs (?<clayRobotCost>.*?) ore. Each obsidian robot costs (?<obsidianRobotCostOre>.*?) ore and (?<obsidianRobotCostClay>.*?) clay. Each geode robot costs (?<geodeRobotCostOre>.*?) ore and (?<geodeRobotCostObsidian>.*?) obsidian./i;

  const group = line.match(pattern)?.groups!!;

  return {
    index: parseInt(group.index),

    // [ore, clay, obsidian, geode]
    costs: {
      ore: [parseInt(group.oreRobotCost)],
      clay: [parseInt(group.clayRobotCost)],
      obsidian: [
        parseInt(group.obsidianRobotCostOre),
        parseInt(group.obsidianRobotCostClay),
      ],
      geode: [
        parseInt(group.geodeRobotCostOre),
        0,
        parseInt(group.geodeRobotCostObsidian),
      ],
    },
  };
});

type Blueprint = typeof blueprints[0];

type InventoryList = [
  ore: number,
  clay: number,
  obsidian: number,
  geode: number
];

type Inventory = {
  robots: InventoryList;
  elements: InventoryList;
  time: number;
};

const createInventory = (robots: InventoryList = [0, 0, 0, 0]): Inventory => ({
  robots,
  elements: [0, 0, 0, 0],
  time: 0,
});

type ElementType = typeof ORE | typeof CLAY | typeof OBSIDIAN | typeof GEODE;
type Cost = Blueprint["costs"][keyof Blueprint["costs"]];

const canBuild = (type: ElementType, inventory: Inventory, cost: Cost) =>
  cost.every((c, i) => c <= inventory.elements[i]);

const updateInventory = (
  inventory: Inventory,
  newRobotType?: ElementType,
  cost: Cost = []
): Inventory => {
  const robots = inventory.robots;
  const elements = inventory.elements;

  const newRobots = robots.map((r, i) => {
    if (i === 0 && newRobotType === ORE) {
      return r + 1;
    }
    if (i === 1 && newRobotType === CLAY) {
      return r + 1;
    }
    if (i === 2 && newRobotType === OBSIDIAN) {
      return r + 1;
    }
    if (i === 3 && newRobotType === GEODE) {
      return r + 1;
    }

    return r;
  }) as InventoryList;

  const builtElements = robots.map((r) => r);
  const deductedElements = elements.map((e, i) =>
    typeof cost[i] === "number" ? Math.max(0, e - cost[i]) : e
  );

  const newElements = deductedElements.map(
    (e, i) => e + builtElements[i]
  ) as InventoryList;

  return {
    robots: newRobots,
    elements: newElements,
    time: inventory.time + 1,
  };
};

const getInventoryScore = (inventory: Inventory, minutes: number) => {
  const timeRemaining = minutes - inventory.time;
  const potentialGeodes =
    inventory.elements[3] + inventory.robots[3] * timeRemaining;

  return (
    inventory.robots[0] +
    inventory.robots[1] * 5 +
    inventory.robots[2] * 25 +
    potentialGeodes * 100
  );
};

const paths: ElementType[] = [ORE, CLAY, OBSIDIAN, GEODE];

const getLargestGeodeCount = (blueprint: Blueprint, minutes: number) => {
  let round: Inventory[] = [createInventory([1, 0, 0, 0])];
  let nextRound: Inventory[] = [];

  for (let i = 0; i < minutes; i++) {
    for (const inventory of round) {
      for (const path of paths) {
        if (canBuild(path, inventory, blueprint.costs[path])) {
          const newInventory = updateInventory(
            inventory,
            path,
            blueprint.costs[path]
          );

          nextRound.push(newInventory);
        }
      }

      const newInventory = updateInventory(inventory);
      nextRound.push(newInventory);
    }

    const inventoryScores = nextRound.map((inventory) =>
      getInventoryScore(inventory, minutes)
    );

    round = nextRound
      .map((inventory, i) => ({
        inventory,
        score: inventoryScores[i],
      }))
      .sort((a, b) => b.score - a.score)
      .map((r) => r.inventory)
      .slice(0, 3000);

    nextRound = [];
  }

  const largestGeodeCount = Math.max(
    ...round.map((inventory) => inventory.elements[3])
  );

  return largestGeodeCount;
};

const totalQualityLevel = blueprints.reduce(
  (acc, bp) => acc + getLargestGeodeCount(bp, 24) * bp.index,
  0
);

console.log("part 1", totalQualityLevel);

// Part 2

const blueprintsPt2 = [...blueprints].slice(0, 3);

const multipliedGeodes = blueprintsPt2.reduce(
  (acc, bp) => acc * getLargestGeodeCount(bp, 32),
  1
);

console.log("part 2", multipliedGeodes);
