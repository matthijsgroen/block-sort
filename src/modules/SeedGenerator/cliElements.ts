export const clearLine = () => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
};

export const progressBar = (
  current: number,
  total: number,
  barLength: number = 40
) => {
  const percentage = (current / total) * 100;
  const filledLength = Math.round((barLength * current) / total);
  const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);
  process.stdout.write(
    `[${bar}] ${current}/${total} (${percentage.toFixed(2)}%)\r`
  );
};

export const doubleProgressBar = (
  currentStep: number,
  totalSteps: number,
  current: number,
  total: number,
  barLength = 40
) => {
  const percentage = (currentStep / totalSteps) * 100;

  const filledLength = Math.round((barLength * current) / total);
  const filledStepLength = Math.round((barLength * currentStep) / totalSteps);
  const both = Math.min(filledLength, filledStepLength);
  const barFilledLength = Math.max(filledLength, filledStepLength);

  let bar = "█".repeat(both);
  if (filledLength > filledStepLength) {
    bar += "▄".repeat(barFilledLength - both);
  } else {
    bar += "▀".repeat(barFilledLength - both);
  }
  bar += "-".repeat(barLength - barFilledLength);

  process.stdout.write(
    `[${bar}] ${currentStep}/${totalSteps} (${percentage.toFixed(2)}%) - ${current}/${total}\r`
  );
};