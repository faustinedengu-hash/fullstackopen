import React, { useState } from "react";
import { Grid, Button, Form, Segment } from "semantic-ui-react";
import { HealthCheckRating, EntryWithoutId } from "../types";

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating,
    });
  };

  return (
    <Segment style={{ marginBottom: '2em' }}>
      <Form onSubmit={addEntry}>
        <Form.Field>
          <label>Description</label>
          <input
            placeholder="Description"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Specialist</label>
          <input
            placeholder="Specialist"
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Health Check Rating (0-3)</label>
          <input
            type="number"
            min={0}
            max={3}
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(Number(target.value))}
          />
        </Form.Field>
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
              disabled={!description || !date || !specialist}
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