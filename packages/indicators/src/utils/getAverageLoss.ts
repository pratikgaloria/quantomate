const getAverageLoss = (array: number[], period: number) => {
  const datasetLength = array.length;
  const requiredLength = period + 1;

  if (datasetLength < requiredLength) {
    return undefined;
  }

  let averageLoss = 0;
  for (let i = datasetLength - 2; i > datasetLength - requiredLength; i--) {
    const currentValue = array[i];
    const previousValue = array[i - 1];

    const difference = currentValue - previousValue;
    averageLoss += difference < 0 ? -difference : 0;
  }

  return averageLoss / period;
};

export default getAverageLoss;