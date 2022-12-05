import fs from "fs";
import path from "path";

export const getPuzzle = (dirname: string) =>
  fs.readFileSync(path.join(dirname, "puzzle.txt")).toString();
