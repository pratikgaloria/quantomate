const getAverageGain = (array: number[], period: number) => {
  const datasetLength = array.length;
  const requiredLength = period + 1;

  if (datasetLength < requiredLength) {
    return undefined;
  }

  let averageGain = 0;
  for (let i = datasetLength - 2; i > datasetLength - requiredLength; i--) {
    const currentValue = array[i];
    const previousValue = array[i - 1];

    const difference = currentValue - previousValue;
    averageGain += difference > 0 ? difference : 0;
  }

  return averageGain / period;
};

export default getAverageGain;