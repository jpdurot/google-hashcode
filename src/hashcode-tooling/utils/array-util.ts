export function removeFromArray(array: any[], index: number): void {
  // remove an index from an array with O(1) complexity
  array[index] = array[array.length - 1];
  array.pop();
}
