const getAverageGain = (array: number[], period: number) => {
  const datasetLength = array.length;
  const requiredLength = period + 1;

  if (datasetLength < requiredLength) {
    return undefined;
  }

  let averageGain = 0;
  for (let i = datasetLength - 1; i >= datasetLength - period; i--) {
    const difference = array[i] - array[i - 1];
    averageGain += difference > 0 ? difference : 0;
  }

  return averageGain / period;
};

export default getAverageGain;