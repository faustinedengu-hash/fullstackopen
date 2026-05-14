import patients from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient, Gender } from '../types';
import { v1 as uuid } from 'uuid';

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender: gender as Gender,
    occupation
  }));
};

const findById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
    entries: []
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  findById
};