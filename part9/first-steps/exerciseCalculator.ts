interface ExerciseValues {
  target: number;
  dailyHours: number[];
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error('Provided values were not numbers!');
  }

  // Slice from index 3 to the end to get all daily hours, and convert them to numbers
  const dailyHours = args.slice(3).map(arg => {
    const num = Number(arg);
    if (isNaN(num)) {
      throw new Error('Provided values were not numbers!');
    }
    return num;
  });

  return {
    target,
    dailyHours
  };
};

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

try {
  const { target, dailyHours } = parseArguments(process.argv);
  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}