import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon, Segment } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient, Entry } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
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
          <p>Health check rating: {entry.healthCheckRating}</p>
          <p>Diagnosed by {entry.specialist}</p>
        </Segment>
      );
    default:
      return assertNever(entry);
  }
};

const PatientPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const patient = Object.values(patients).find((p) => p.id === id);

  React.useEffect(() => {
    const fetchPatient = async () => {
      // FIX: Fetch if we don't have the patient AT ALL, or if we are missing their SSN
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
      {/* FIX: Add a safeguard in case patient.entries is completely undefined */}
      {!patient.entries || patient.entries.length === 0 ? (
        <p>No entries found for this patient.</p>
      ) : (
        patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))
      )}
    </div>
  );
};

export default PatientPage;