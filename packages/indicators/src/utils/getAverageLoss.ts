const getAverageLoss = (array: number[], period: number) => {
  const datasetLength = array.length;
  const requiredLength = period + 1;

  if (datasetLength < requiredLength) {
    return undefined;
  }

  let averageLoss = 0;
  for (let i = datasetLength - 1; i >= datasetLength - period; i--) {
    const difference = array[i] - array[i - 1];
    averageLoss += difference < 0 ? -difference : 0;
  }

  return averageLoss / period;
};

export default getAverageLoss;