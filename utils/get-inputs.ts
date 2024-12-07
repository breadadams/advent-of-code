export const getInputs = async (basePath: string) => {
  const exampleInput = await Bun.file(`${basePath}/example.txt`).text();
  const puzzleInput = await Bun.file(`${basePath}/puzzle.txt`).text();

  return { exampleInput, puzzleInput };
};
