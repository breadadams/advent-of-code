import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname);

const commands = puzzleInput.split("\n").filter((c) => !!c);

interface Tree {
  [key: string]: TreeValue;
}

type TreeValue = number | Tree;

const tree: Tree = {};
let dirPosition: string[] = [];

const updateTree = (name: string, payload: TreeValue) => {
  let ref = tree;
  const pos = [...dirPosition];
  const lastPos = pos.pop() as string;

  for (let i = 0; i < pos.length; i++) {
    const dir = pos[i];
    ref = ref[dir] as Tree;
  }

  ref[lastPos] = {
    ...(ref[lastPos] as Tree),
    [name]: payload,
  };
};

// Create object representation of file structure
for (let i = 0; i < commands.length; i++) {
  const command = commands[i];

  if (command.startsWith("$ cd ")) {
    const dir = command.replace("$ cd ", "");

    if (dir === "..") {
      dirPosition.pop();
    } else {
      dirPosition.push(dir);
    }
  } else if (command.startsWith("dir ")) {
    const dir = command.replace("dir ", "");

    updateTree(dir, {});
  } else if (command.startsWith("$ ls")) {
    // do nothing
  } else {
    const [size, name] = command.split(" ");

    updateTree(name, Number(size));
  }
}

// console.log(JSON.stringify(tree, null, 2));

// Calculate directory sizes
const dirSizes: number[] = [];

const getDirSize = (t: Tree): number => {
  let size = 0;
  const treeValues = Object.values(t);

  for (let i = 0; i < treeValues.length; i++) {
    const value = treeValues[i];

    if (typeof value === "number") {
      size += value;
    } else {
      size += getDirSize(value);
    }
  }

  dirSizes.push(size);

  return size;
};

const rootSize = getDirSize(tree);

const SIZE_LIMIT = 100000;

const totalDirSizeBelowLimit = dirSizes
  .filter((size) => size <= SIZE_LIMIT)
  .reduce((acc, size) => acc + size, 0);

// Part 1
console.log("part 1", totalDirSizeBelowLimit);

// Part 2
const TOTAL_DISK_SPACE = 70000000;
const REQ_DISK_SPACE = 30000000;

const freeSpace = TOTAL_DISK_SPACE - rootSize;
const spaceRequired = REQ_DISK_SPACE - freeSpace;

const spaceToDelete = Math.min(
  ...dirSizes.filter((size) => size >= spaceRequired)
);

console.log("part 2", spaceToDelete);
