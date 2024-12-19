import { timePart1, timePart2 } from "../../utils/time-part";

const parseInput = (input: string) => {
  const [availableTowels, designs] = input.split("\n\n");

  return {
    availableTowels: availableTowels.split(", "),
    designs: designs.split("\n"),
  };
};

export const part1 = timePart1((input: string) => {
  const { availableTowels, designs } = parseInput(input);
  let possibleDesigns = 0;

  for (const design of designs) {
    let queue: Array<{ remaining: string }> = [];

    for (const towel of availableTowels) {
      if (design.indexOf(towel) === 0) {
        queue.push({ remaining: design.substring(towel.length) });
      }
    }

    while (queue.length) {
      queue.sort((a, b) => a.remaining.length - b.remaining.length);
      const entry = queue.shift()!;

      for (const towel of availableTowels) {
        if (entry.remaining.indexOf(towel) === 0) {
          if (entry.remaining.length === towel.length) {
            possibleDesigns++;
            queue = [];
            break;
          }

          queue.push({ remaining: entry.remaining.substring(towel.length) });
        }
      }
    }
  }

  return possibleDesigns;
});

export const part2 = timePart2((input: string) => {
  const { availableTowels, designs } = parseInput(input);
  let possibleDesigns = 0;
  const canBeCompleted = new Map<string, number>();

  const countTowelVariants = (remaining: string) => {
    if (canBeCompleted.has(remaining)) {
      return canBeCompleted.get(remaining)!;
    }

    let variants = 0;

    for (const towel of availableTowels) {
      if (remaining.indexOf(towel) === 0) {
        if (remaining.length === towel.length) {
          variants++;
          continue;
        }

        variants += countTowelVariants(remaining.substring(towel.length));
      }
    }

    canBeCompleted.set(remaining, variants);
    return variants;
  };

  for (const design of designs) {
    possibleDesigns += countTowelVariants(design);
  }

  return possibleDesigns;
});
