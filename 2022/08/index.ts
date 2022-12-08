import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const treeGrid = puzzleInput
  .split("\n")
  .map((row) => row.split("").map((v) => Number(v)));

const gridSize = treeGrid.length;

// console.log(JSON.stringify(treeGrid, null, 2));

const edgeTreeCount = gridSize * 2 + (gridSize - 2) * 2;

const filterOuterTrees = (
  _: number | Array<number>,
  i: number,
  arr: Array<number | Array<number>>
) => i > 0 && i < arr.length - 1;

const innerTreeGrid = treeGrid
  .filter(filterOuterTrees)
  .map((row) => row.filter(filterOuterTrees));

// console.log(JSON.stringify(innerTreeGrid, null, 2));

const innerGridSize = innerTreeGrid.length;

const visibleInnerTrees: number[] = [];

const isTreeVisible = (height: number, row: number, column: number) => {
  const rowValues = treeGrid[row];
  const colValues = treeGrid.map((r) => r[column]);

  const rowBefore = rowValues.slice(0, column);
  const rowAfter = rowValues.slice(column + 1);

  const colBefore = colValues.slice(0, row);
  const colAfter = colValues.slice(row + 1);

  const smallerThanHeight = (v: number) => v < height;

  return (
    rowBefore.every(smallerThanHeight) ||
    rowAfter.every(smallerThanHeight) ||
    colBefore.every(smallerThanHeight) ||
    colAfter.every(smallerThanHeight)
  );
};

for (let i = 0; i < innerGridSize; i++) {
  const row = innerTreeGrid[i];

  for (let j = 0; j < row.length; j++) {
    const height = row[j];

    if (isTreeVisible(height, i + 1, j + 1)) {
      visibleInnerTrees.push(height);
    }
  }
}

const totalVisibleTrees = edgeTreeCount + visibleInnerTrees.length;

console.log("part 1", totalVisibleTrees);

// Part 2
const scientificScores: number[] = [];

const countVisibleTrees = (height: number, trees: number[]) => {
  for (let i = 0; i < trees.length; i++) {
    if (trees[i] >= height) {
      return i + 1;
    }
  }

  return trees.length;
};

const getScientificScore = (height: number, row: number, column: number) => {
  const rowValues = treeGrid[row];
  const colValues = treeGrid.map((r) => r[column]);

  const rowBefore = rowValues.slice(0, column).reverse();
  const rowAfter = rowValues.slice(column + 1);

  const colBefore = colValues.slice(0, row).reverse();
  const colAfter = colValues.slice(row + 1);

  const scoreUp = countVisibleTrees(height, colBefore);
  const scoreDown = countVisibleTrees(height, colAfter);
  const scoreLeft = countVisibleTrees(height, rowBefore);
  const scoreRight = countVisibleTrees(height, rowAfter);

  return scoreUp * scoreDown * scoreLeft * scoreRight;
};

for (let i = 0; i < gridSize; i++) {
  const row = treeGrid[i];

  for (let j = 0; j < row.length; j++) {
    const height = row[j];

    scientificScores.push(getScientificScore(height, i, j));
  }
}

const largestScientificScore = Math.max(...scientificScores);

console.log("part 2", largestScientificScore);
