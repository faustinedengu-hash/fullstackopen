import React, { useState } from "react";
import { Grid, Button, Form, Segment, Dropdown } from "semantic-ui-react";
import { HealthCheckRating, EntryWithoutId } from "../types";
import { useStateValue } from "../state";

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  // Grab the diagnoses from global state
  const [{ diagnoses }] = useStateValue();

  // 1. State for the entry type
  const [type, setType] = useState<"HealthCheck" | "Hospital" | "OccupationalHealthcare">("HealthCheck");

  // Base fields (shared by all types)
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]); // NEW: Diagnosis Codes state

  // HealthCheck specific
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);

  // Hospital specific
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // OccupationalHealthcare specific
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  // Format diagnoses for the Semantic UI Dropdown
  const diagnosisOptions = Object.values(diagnoses).map((d) => ({
    key: d.code,
    text: `${d.code} - ${d.name}`,
    value: d.code,
  }));

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    
    // The base object every entry needs (now includes diagnosisCodes)
    const baseEntry = { 
      description, 
      date, 
      specialist,
      diagnosisCodes 
    };

    // 2. Build the correct object based on the selected type
    switch (type) {
      case "HealthCheck":
        onSubmit({
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating,
        });
        break;
      case "Hospital":
        onSubmit({
          ...baseEntry,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });
        break;
      case "OccupationalHealthcare": { 
        const newEntry: EntryWithoutId = {
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName,
        };
        if (sickLeaveStart && sickLeaveEnd) {
          newEntry.sickLeave = { startDate: sickLeaveStart, endDate: sickLeaveEnd };
        }
        onSubmit(newEntry);
        break;
      } 
    }
  };

  return (
    <Segment style={{ marginBottom: "2em" }}>
      <Form onSubmit={addEntry}>
        {/* Dropdown to select Entry Type */}
        <Form.Field>
          <label>Entry Type</label>
          <select 
            value={type} 
            onChange={({ target }) => setType(target.value as "HealthCheck" | "Hospital" | "OccupationalHealthcare")}
          >
            <option value="HealthCheck">Health Check</option>
            <option value="Hospital">Hospital</option>
            <option value="OccupationalHealthcare">Occupational Healthcare</option>
          </select>
        </Form.Field>

        {/* Base Fields (Always visible) */}
        <Form.Field>
          <label>Description</label>
          <input placeholder="Description" value={description} onChange={({ target }) => setDescription(target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Date</label>
          <input type="date" value={date} onChange={({ target }) => setDate(target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Specialist</label>
          <input placeholder="Specialist" value={specialist} onChange={({ target }) => setSpecialist(target.value)} />
        </Form.Field>

        {/* NEW: Diagnosis Codes Multi-Select */}
        <Form.Field>
          <label>Diagnosis Codes</label>
          <Dropdown
            fluid
            multiple
            search
            selection
            options={diagnosisOptions}
            onChange={(_event, data) => setDiagnosisCodes(data.value as string[])}
          />
        </Form.Field>

        {/* 3. Conditional Fields based on the selected Type */}
        {type === "HealthCheck" && (
          <Form.Field>
            <label>Health Check Rating (0-3)</label>
            <input type="number" min={0} max={3} value={healthCheckRating} onChange={({ target }) => setHealthCheckRating(Number(target.value))} />
          </Form.Field>
        )}

        {type === "Hospital" && (
          <>
            <Form.Field>
              <label>Discharge Date</label>
              <input type="date" value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)} />
            </Form.Field>
            <Form.Field>
              <label>Discharge Criteria</label>
              <input placeholder="Criteria" value={dischargeCriteria} onChange={({ target }) => setDischargeCriteria(target.value)} />
            </Form.Field>
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <Form.Field>
              <label>Employer Name</label>
              <input placeholder="Employer Name" value={employerName} onChange={({ target }) => setEmployerName(target.value)} />
            </Form.Field>
            <Form.Field>
              <label>Sick Leave Start Date</label>
              <input type="date" value={sickLeaveStart} onChange={({ target }) => setSickLeaveStart(target.value)} />
            </Form.Field>
            <Form.Field>
              <label>Sick Leave End Date</label>
              <input type="date" value={sickLeaveEnd} onChange={({ target }) => setSickLeaveEnd(target.value)} />
            </Form.Field>
          </>
        )}

        <Grid>
          <Grid.Column floated="left" width={5}>
            <Button type="button" onClick={onCancel} color="red">
              Cancel
            </Button>
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <Button type="submit" floated="right" color="green">
              Add
            </Button>
          </Grid.Column>
        </Grid>
      </Form>
    </Segment>
  );
};

export default AddEntryForm;