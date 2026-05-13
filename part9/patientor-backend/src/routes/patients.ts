import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
  const { name, dateOfBirth, ssn, occupation, gender } = req.body;
  const newPatient = patientService.addPatient({
    name,
    dateOfBirth,
    ssn,
    occupation,
    gender
  });
  res.json(newPatient);
});

export default router;