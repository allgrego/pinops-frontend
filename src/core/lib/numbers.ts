export function numberOrNull(
  value: string | number | null | undefined
): number | null {
  if (!["number", "string"].includes(typeof value)) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    // Check if the string can be parsed as a valid number
    const parsed = Number(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}
