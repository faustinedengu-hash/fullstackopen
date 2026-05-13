import patientData from '../../data/patients.json';
import { Patient, NonSensitivePatient } from '../types';

const patients: Patient[] = patientData as Patient[];

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

export default {
  getNonSensitiveEntries
};