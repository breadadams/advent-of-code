import fs from "fs";
import path from "path";
import inquirer from "inquirer";

const root = path.join(__dirname, "..");
const today = new Date();
const padDay = (day: string | number) => `${day}`.padStart(2, "0");

const tsFileContents = `
import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();

// Part 1
(() => {
  console.time("part 1");

  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");

  console.timeEnd("part 2");
})();
`.trim();

inquirer
  .prompt([
    { name: "year", default: `${today.getFullYear()}` },
    { name: "day", default: padDay(today.getDate()) },
  ])
  .then((answers) => {
    const yearPath = path.join(root, answers.year);

    fs.readdir(yearPath, (err) => {
      if (err?.code === "ENOENT") {
        fs.mkdirSync(yearPath);
      }

      const dayPath = path.join(yearPath, padDay(answers.day));
      fs.mkdirSync(dayPath);

      fs.writeFileSync(path.join(dayPath, "index.ts"), tsFileContents);
      fs.writeFileSync(path.join(dayPath, "puzzle.txt"), "");
    });
  });
