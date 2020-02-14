export function union<T>(firstSet: Set<T>, secondSet: Set<T>): Set<T> {
  return new Set([...firstSet, ...secondSet]);
}

export function intersection<T>(firstSet: Set<T>, secondSet: Set<T>): Set<T> {
  return new Set([...firstSet].filter(value => secondSet.has(value)));
}

export function difference<T>(firstSet: Set<T>, secondSet: Set<T>): Set<T> {
  return new Set([...firstSet].filter(value => !secondSet.has(value)));
}
