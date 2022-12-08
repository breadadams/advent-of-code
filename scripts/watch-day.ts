import path from "path";
import inquirer from "inquirer";
import nodemon from "nodemon";

const root = path.join(__dirname, "..");
const today = new Date();
const padDay = (day: string | number) => `${day}`.padStart(2, "0");

inquirer
  .prompt([
    { name: "year", default: `${today.getFullYear()}` },
    { name: "day", default: padDay(today.getDate()) },
  ])
  .then((answers) => {
    const script = path.join(
      root,
      answers.year,
      padDay(answers.day),
      "index.ts"
    );

    nodemon({ script, ext: "ts txt" });
  });
