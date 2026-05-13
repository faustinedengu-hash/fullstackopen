import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient } from "../types";

const PatientPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  // Look up the patient in our global state dictionary
  const patient = Object.values(patients).find((p) => p.id === id);

  React.useEffect(() => {
    const fetchPatient = async () => {
      // Only fetch if we haven't already fetched their full data (SSN is a good indicator)
      if (id && patient && !patient.ssn) {
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

  // Map the gender to the correct Semantic UI icon
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
      {/* We will map over entries in future exercises */}
    </div>
  );
};

export default PatientPage;