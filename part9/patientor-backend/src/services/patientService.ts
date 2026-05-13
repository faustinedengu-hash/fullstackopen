import patientData from '../../data/patients.json';
import { Patient, NonSensitivePatient, NewPatient, Gender } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData as Patient[];

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender: gender as Gender, // Explicitly cast to our Enum
    occupation
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getNonSensitiveEntries,
  addPatient
};