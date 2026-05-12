interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyHours: number[], target: number): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(day => day > 0).length;
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating = 2;
  let ratingDescription = 'not too bad but could be better';

  if (average >= target) {
    rating = 3;
    ratingDescription = 'excellent work, you met your target!';
  } else if (average < target * 0.5) {
    rating = 1;
    ratingDescription = 'you need to try much harder next time';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

// Hardcoded call as requested by Exercise 9.2
console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));