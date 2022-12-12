import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const heightMap = puzzleInput.split("\n").map((row) => row.split(""));

const mapHeight = heightMap.length;
const mapWidth = heightMap[0].length;

interface Point {
  x: number;
  y: number;
}

const heightMapAsNumbers = heightMap.map((row) =>
  row.map((letter) => {
    if (letter === "S") {
      return 1;
    }

    if (letter === "E") {
      return 26;
    }

    return letter.charCodeAt(0) - 97 + 1;
  })
);

class Cell {
  x: number;
  y: number;
  gScore?: number;
  end: Point;

  constructor(x: number, y: number, end: Point) {
    this.x = x;
    this.y = y;
    this.end = end;
    this.gScore = undefined;
  }

  get fScore() {
    if (typeof this.gScore !== "undefined") {
      return (
        this.gScore +
        Math.abs(this.end.x - this.x) +
        Math.abs(this.end.y - this.y)
      );
    }

    return 0;
  }

  get numberValue() {
    return heightMapAsNumbers[this.y][this.x];
  }

  get neighbourKeys() {
    const keys: string[] = [];

    // Can go up
    if (this.y > 0) {
      const newY = this.y - 1;
      const neighUpNumberValue = heightMapAsNumbers[newY][this.x];

      if (
        neighUpNumberValue - this.numberValue <= 1 ||
        neighUpNumberValue < this.numberValue
      ) {
        keys.push(`${this.x},${this.y - 1}`);
      }
    }

    // Can go right
    if (this.x < mapWidth - 1) {
      const newX = this.x + 1;
      const neighRightNumberValue = heightMapAsNumbers[this.y][newX];

      if (
        neighRightNumberValue - this.numberValue <= 1 ||
        neighRightNumberValue < this.numberValue
      ) {
        keys.push(`${newX},${this.y}`);
      }
    }

    // Can go down
    if (this.y < mapHeight - 1) {
      const newY = this.y + 1;
      const neighDownNumberValue = heightMapAsNumbers[newY][this.x];

      if (
        neighDownNumberValue - this.numberValue <= 1 ||
        neighDownNumberValue < this.numberValue
      ) {
        keys.push(`${this.x},${newY}`);
      }
    }

    // Can go left
    if (this.x > 0) {
      const newX = this.x - 1;
      const neighLeftNumberValue = heightMapAsNumbers[this.y][newX];

      if (
        neighLeftNumberValue - this.numberValue <= 1 ||
        neighLeftNumberValue < this.numberValue
      ) {
        keys.push(`${newX},${this.y}`);
      }
    }

    return keys;
  }
}

const getDistance = (a: Cell, b: Cell) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getShortestPath = (start: Point, end: Point) => {
  const startPointKey = `${start.x},${start.y}`;

  const cellMap = heightMap.reduce((acc, row, rowIndex) => {
    const cells = row.reduce((accRow, _, colIndex) => {
      return {
        ...accRow,
        [`${colIndex},${rowIndex}`]: new Cell(colIndex, rowIndex, end),
      };
    }, {});

    return { ...acc, ...cells };
  }, {} as Record<string, Cell>);

  cellMap[startPointKey].gScore = 0;

  const openList = [startPointKey];

  const getNextPoint = () => {
    const lowestFScoreKey = openList
      .map((key) => ({ key, fScore: cellMap[key].fScore }))
      .sort((a, b) => {
        if (a.fScore < b.fScore) {
          return -1;
        }

        if (a.fScore > b.fScore) {
          return 1;
        }

        return 0;
      })[0].key;

    const nextPoint = cellMap[lowestFScoreKey];
    openList.splice(openList.indexOf(lowestFScoreKey), 1);

    return nextPoint;
  };

  while (openList.length > 0) {
    const nextPoint = getNextPoint();

    if (nextPoint.x === end.x && nextPoint.y === end.y) {
      return nextPoint.gScore;
    }

    for (const neighbourKey of nextPoint.neighbourKeys) {
      const neighbour = cellMap[neighbourKey];

      const newGScore =
        (nextPoint.gScore || 0) + getDistance(nextPoint, neighbour);

      if (
        typeof neighbour.gScore === "undefined" ||
        newGScore < neighbour.gScore
      ) {
        neighbour.gScore = newGScore;

        if (!openList.includes(neighbourKey)) {
          openList.push(neighbourKey);
        }
      }
    }
  }
};

// Part 1
(() => {
  const startY = heightMap.findIndex((row) => row.includes("S"));
  const startX = heightMap[startY].findIndex((cell) => cell === "S");

  const endY = heightMap.findIndex((row) => row.includes("E"));
  const endX = heightMap[endY].findIndex((cell) => cell === "E");

  const startPoint: Point = { x: startX, y: startY };
  const endPoint: Point = { x: endX, y: endY };

  const shortest = getShortestPath(startPoint, endPoint);

  console.log("part 1", shortest);
})();

// Part 2
(() => {
  const startPoints = heightMapAsNumbers.reduce((acc, row, rowIndex) => {
    const points = row.reduce((acc2, cell, cellIndex) => {
      if (cell === 1) {
        return [...acc2, { x: cellIndex, y: rowIndex }];
      }

      return acc2;
    }, [] as Point[]);

    return [...acc, ...points];
  }, [] as Point[]);

  const endY = heightMap.findIndex((row) => row.includes("E"));
  const endX = heightMap[endY].findIndex((cell) => cell === "E");

  const endPoint: Point = { x: endX, y: endY };

  const shortestPaths = startPoints
    .map((startPoint) => getShortestPath(startPoint, endPoint))
    .filter((v) => typeof v === "number") as number[];

  const shortest = Math.min(...shortestPaths);

  console.log("part 2", shortest);
})();
