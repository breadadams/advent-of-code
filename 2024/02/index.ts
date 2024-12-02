import { getPuzzle } from "../../utils";

const puzzleInput = getPuzzle(__dirname).trim();
const lines = puzzleInput.split("\n");
const reports = lines.map((line) =>
  line.split(" ").map((str) => parseInt(str))
);

const isReportSafe = (report: number[]) => {
  let isSafe = true;
  let isIncreasing = false;
  let unsafeIndex = -1;

  for (let i = 1; i < report.length; i++) {
    const entry = report[i];
    const prevEntry = report[i - 1];

    if (entry === prevEntry) {
      isSafe = false;
      unsafeIndex = i;
      break;
    }

    if (i === 1) {
      isIncreasing = entry > prevEntry;
    } else {
      if (isIncreasing && entry < prevEntry) {
        isSafe = false;
        unsafeIndex = i;
        break;
      } else if (!isIncreasing && entry > prevEntry) {
        isSafe = false;
        unsafeIndex = i;
        break;
      }
    }

    if (Math.abs(entry - prevEntry) > 3) {
      isSafe = false;
      unsafeIndex = i;
      break;
    }
  }

  return isSafe;
};

// Part 1
(() => {
  console.time("part 1");

  const safeReports = reports.filter(isReportSafe);

  console.log("part1 safeReports.length ::", safeReports.length);
  console.timeEnd("part 1");
})();

// Part 2
(() => {
  console.time("part 2");

  const safeReports = reports.filter((report) => {
    const isSafe = isReportSafe(report);

    if (isSafe) {
      return true;
    }

    let secondChanceSafe = false;

    for (let i = 0; i < report.length; i++) {
      const modifiedReport = [...report];
      modifiedReport.splice(i, 1);

      const secondChance = isReportSafe(modifiedReport);

      if (secondChance) {
        secondChanceSafe = true;
        break;
      }
    }

    return secondChanceSafe;
  });

  console.log("part2 safeReports.length ::", safeReports.length);
  console.timeEnd("part 2");
})();
