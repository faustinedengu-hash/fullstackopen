import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

// We need this middleware to parse incoming JSON data in the req.body
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!req.query.height || !req.query.weight || isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const bmi = calculateBmi(height, weight);

  res.json({
    weight,
    height,
    bmi
  });
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body;

  // 1. Check if parameters are missing
  if (!daily_exercises || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  // 2. Validate types (target must be a number, daily_exercises must be an array)
  if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  // 3. Ensure every item in the daily_exercises array is a valid number
  const hasInvalidHours = daily_exercises.some(hours => isNaN(Number(hours)));
  if (hasInvalidHours) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  // 4. Calculate and return the result
  const parsedExercises = daily_exercises.map(h => Number(h));
  const result = calculateExercises(parsedExercises, Number(target));

  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});