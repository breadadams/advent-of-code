const timePart =
  (_label: string) =>
  <T extends (...args: any[]) => any>(fn: T) =>
  (...args: Parameters<T>): ReturnType<T> => {
    const label = `\x1b[42m ${_label} \x1b[0m`;

    console.time(label);
    const result = fn(...args);
    console.timeEnd(label);

    return result;
  };

export const timePart1 = timePart("⏰ part 1");

export const timePart2 = timePart("⏰ part 2");
