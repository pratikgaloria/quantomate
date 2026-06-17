export function growTypedArray(arr: Float64Array, newCapacity: number): Float64Array {
  const newArr = new Float64Array(newCapacity);
  newArr.set(arr);
  return newArr;
}
