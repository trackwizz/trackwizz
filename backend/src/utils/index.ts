/**
 * Pause the program for x milliseconds.
 * @param ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * Return a date object from string or number input.
 * @param input
 */
export function toDate(input: number | string): Date | null {
  if (typeof input === "string") {
    if (/^\d+$/.test(input)) {
      // parse string timestamp to number.
      return new Date(parseInt(input, 10)) || null;
    } else {
      // send string that should be in YYYY-MM-DDTHH:MM:SS.SSSZ format.
      return new Date(input) || null;
    }
  }
  return new Date(input) || null;
}
