import fs from "fs";
import path from "path";
import inquirer from "inquirer";

const root = path.join(__dirname, "..");
const today = new Date();
const padDay = (day: string | number) => `${day}`.padStart(2, "0");

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

      fs.writeFileSync(path.join(dayPath, "index.ts"), "");
      fs.writeFileSync(path.join(dayPath, "puzzle.txt"), "");
    });
  });
