import patients from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient, Gender, Entry } from '../types';
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

// --- NEW FUNCTION ---
const addEntry = (patientId: string, entry: any): Patient | undefined => {
  const patient = patients.find(p => p.id === patientId);
  
  if (!patient) {
    return undefined; // Patient not found
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);
  return patient;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry // Don't forget to export it!
};