
const calculateBmi = (height: number, weight: number): string => {
  // Convert height from centimeters to meters
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal (healthy weight)';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};

// Hardcoded call as requested by Exercise 9.1
console.log(calculateBmi(180, 74));