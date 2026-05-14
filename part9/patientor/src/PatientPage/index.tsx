import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon, Segment } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient, Entry, Diagnosis } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

// Helper component to display diagnosis codes and names
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
          <h3>
            {entry.date} <Icon name="hospital" />
          </h3>
          <p>
            <i>{entry.description}</i>
          </p>
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
          <p>
            Discharge: {entry.discharge.date} - {entry.discharge.criteria}
          </p>
          <p>Diagnosed by {entry.specialist}</p>
        </Segment>
      );
    case "OccupationalHealthcare":
      return (
        <Segment>
          <h3>
            {entry.date} <Icon name="stethoscope" /> {entry.employerName}
          </h3>
          <p>
            <i>{entry.description}</i>
          </p>
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
          <p>Diagnosed by {entry.specialist}</p>
        </Segment>
      );
    case "HealthCheck":
      return (
        <Segment>
          <h3>
            {entry.date} <Icon name="user md" />
          </h3>
          <p>
            <i>{entry.description}</i>
          </p>
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
  // Pull diagnoses out of state here
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const patient = Object.values(patients).find((p) => p.id === id);

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

  if (!patient) return null;

  const genderIcon =
    patient.gender === "male"
      ? "mars"
      : patient.gender === "female"
      ? "venus"
      : "genderless";

  return (
    <div style={{ marginTop: "2em" }}>
      <h2>
        {patient.name} <Icon name={genderIcon} />
      </h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>

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