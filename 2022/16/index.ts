import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

interface Valve {
  connectedValves: string[];
  flowRate: number;
  name: string;
}

type Valves = Record<string, Valve>;

interface State {
  flowRates: Record<string, number>;
  name: string;
  openValves: string[];
}

type Queue = Array<State>;

const valves = puzzleInput.split("\n").reduce((acc, line) => {
  const pattern =
    /Valve (?<valveName>.*?) has flow rate=(?<flowRate>.*?); tunnels? leads? to valves? (?<connectedValves>.*$)/i;

  const group = line.match(pattern)?.groups!!;

  const name = group.valveName;
  const flowRate = parseInt(group.flowRate);
  const connectedValves = group.connectedValves.split(", ");

  return {
    ...acc,
    [name]: { name, flowRate, connectedValves },
  };
}, {} as Valves);

const getStateScore = (state: State) =>
  Object.entries(state.flowRates).reduce(
    (acc, [key, minutes]) => acc + valves[key].flowRate * minutes,
    0
  );

// Part 1
(() => {
  const TIME = 30;

  const initialState: State = {
    flowRates: {},
    name: "AA",
    openValves: [],
  };

  let queue: Queue = [initialState];
  let nextQueue: Queue = [];

  for (let minute = 1; minute <= TIME; minute++) {
    for (const state of queue) {
      const valve = valves[state.name];

      // If valve isn't open and has a flowRate of greater than 0.
      if (!state.openValves.includes(valve.name) && valve.flowRate > 0) {
        const newState = {
          flowRates: { ...state.flowRates, [valve.name]: TIME - minute },
          name: valve.name,
          openValves: [...state.openValves, valve.name],
        };

        nextQueue.push(newState);
      }

      // Move to all possible connected valves
      for (const connectedValve of valve.connectedValves) {
        const newState = {
          flowRates: { ...state.flowRates },
          name: connectedValve,
          openValves: [...state.openValves],
        };

        nextQueue.push(newState);
      }
    }

    queue = nextQueue
      .map((s) => ({ state: s, score: getStateScore(s) }))
      .sort((a, b) => b.score - a.score)
      .map((s) => s.state)
      .slice(0, 10_000);

    nextQueue = [];
  }

  console.log("part 1", getStateScore(queue[0]));
})();
