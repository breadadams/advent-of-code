export const getInputs = async (basePath: string) => {
  let exampleInput: string = "";
  let puzzleInput: string = "";

  try {
    exampleInput = await Bun.file(`${basePath}/example.txt`).text();
  } catch {}

  try {
    puzzleInput = await Bun.file(`${basePath}/puzzle.txt`).text();
  } catch {}

  return { exampleInput, puzzleInput };
};
