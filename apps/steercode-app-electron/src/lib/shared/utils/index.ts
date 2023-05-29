export function sleep<T = void>(ms: number, result?: T): Promise<T> {
  if (result === undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}
