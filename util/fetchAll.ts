type AsyncResult<T> = { data: T | null; error: any };

export async function fetchAll<T extends unknown[]>(
  ...promises: {
    [K in keyof T]: Promise<T[K]>;
  }
): Promise<{ [K in keyof T]: AsyncResult<T[K]> }> {
  const results = await Promise.allSettled(promises as Promise<unknown>[]);

  return results.map((r) =>
    r.status === "fulfilled"
      ? { data: r.value, error: null }
      : { data: null, error: r.reason }
  ) as { [K in keyof T]: AsyncResult<T[K]> };
}
