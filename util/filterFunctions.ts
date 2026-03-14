export function filterFunctions(obj: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (typeof obj[key] === "function") continue;
    result[key] = obj[key];
  }
  return result;
}
