import React, { useState } from "react";
import { Grid, Button, Form, Segment } from "semantic-ui-react";
import { HealthCheckRating, EntryWithoutId } from "../types";

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  // 1. State for the entry type
  const [type, setType] = useState<"HealthCheck" | "Hospital" | "OccupationalHealthcare">("HealthCheck");

  // Base fields (shared by all types)
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");

  // HealthCheck specific
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);

  // Hospital specific
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // OccupationalHealthcare specific
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    
    // The base object every entry needs
    const baseEntry = { description, date, specialist };

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
      case "OccupationalHealthcare": { // Added brace here to fix the lint error
        const newEntry: EntryWithoutId = {
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName,
        };
        // Sick leave is optional, so we only add it if the user filled it out
        if (sickLeaveStart && sickLeaveEnd) {
          newEntry.sickLeave = { startDate: sickLeaveStart, endDate: sickLeaveEnd };
        }
        onSubmit(newEntry);
        break;
      } // Added closing brace
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
            <Button 
              type="submit" 
              floated="right" 
              color="green"
              /* We removed the disabled line so we can test the error messages! */
            >
              Add
            </Button>
          </Grid.Column>
        </Grid>
      </Form>
    </Segment>
  );
};

export default AddEntryForm;