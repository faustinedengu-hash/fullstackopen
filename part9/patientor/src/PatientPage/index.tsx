import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon, Segment, Button } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient, Entry, Diagnosis, EntryWithoutId } from "../types";
import AddEntryForm from "./AddEntryForm";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const DiagnosisList = ({ codes, diagnoses }: { codes?: Array<Diagnosis['code']>, diagnoses: { [code: string]: Diagnosis } }) => {
  if (!codes || codes.length === 0) return null;
  return (
    <ul>
      {codes.map(code => (
        <li key={code}>
          {code} {diagnoses[code] ? diagnoses[code].name : null}
        </li>
      ))}
    </ul>
  );
};

const EntryDetails = ({ entry, diagnoses }: { entry: Entry, diagnoses: { [code: string]: Diagnosis } }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Segment>
          <h3>{entry.date} <Icon name="hospital" /></h3>
          <p><i>{entry.description}</i></p>
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
          <p>Discharge: {entry.discharge.date} - {entry.discharge.criteria}</p>
          <p>Diagnosed by {entry.specialist}</p>
        </Segment>
      );
    case "OccupationalHealthcare":
      return (
        <Segment>
          <h3>{entry.date} <Icon name="stethoscope" /> {entry.employerName}</h3>
          <p><i>{entry.description}</i></p>
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
          <p>Diagnosed by {entry.specialist}</p>
        </Segment>
      );
    case "HealthCheck":
      return (
        <Segment>
          <h3>{entry.date} <Icon name="user md" /></h3>
          <p><i>{entry.description}</i></p>
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
          <p>Health check rating: {entry.healthCheckRating}</p>
          <p>Diagnosed by {entry.specialist}</p>
        </Segment>
      );
    default:
      return assertNever(entry);
  }
};

const PatientPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const patient = Object.values(patients).find((p) => p.id === id);

  // TRIPWIRE 4: Let's see if React actually updates the UI
  console.log("🖥️ PATIENT PAGE UI RENDER TRIGGERED. Current error state is:", error);

  React.useEffect(() => {
    const fetchPatient = async () => {
      if (id && (!patient || !patient.ssn)) {
        try {
          const { data: patientDetails } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch({ type: "UPDATE_PATIENT", payload: patientDetails });
        } catch (e) {
          console.error(e);
        }
      }
    };
    void fetchPatient();
  }, [id, patient, dispatch]);

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch({ type: "UPDATE_PATIENT", payload: updatedPatient });
      setShowForm(false);
      setError(undefined); 
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const rawData = e.response?.data;
        const messageToDisplay = rawData ? String(rawData) : "The backend rejected it, but gave no message.";
        setError(messageToDisplay);
      } else {
        setError("A weird non-Axios error happened.");
      }
    }
  };

  if (!patient) return null;

  const genderIcon = patient.gender === "male" ? "mars" : patient.gender === "female" ? "venus" : "genderless";

  return (
    <div style={{ marginTop: "2em" }}>
      <h2>{patient.name} <Icon name={genderIcon} /></h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>

      {/* --- THE UNMISSABLE ERROR BOX --- */}
      {error && (
        <div style={{ 
          backgroundColor: '#ffe6e6', 
          border: '2px solid red', 
          color: 'red', 
          padding: '15px', 
          marginBottom: '20px', 
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          🚨 Backend Validation Error: {error}
        </div>
      )}

      {showForm ? (
        <AddEntryForm onSubmit={submitNewEntry} onCancel={() => setShowForm(false)} />
      ) : (
        <Button onClick={() => setShowForm(true)}>Add New Entry</Button>
      )}

      <h3>entries</h3>
      {!patient.entries || patient.entries.length === 0 ? (
        <p>No entries found for this patient.</p>
      ) : (
        patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))
      )}
    </div>
  );
};

export default PatientPage;