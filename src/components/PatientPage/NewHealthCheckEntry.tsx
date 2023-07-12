import { useState } from 'react';
import { TextField, Button, SelectChangeEvent, Select, InputLabel, MenuItem } from "@mui/material";
import DiagnosisSelector from "./DiagnosisSelector";
import { Patient, Diagnosis, HealthCheckRating } from '../../types';
import patientService from '../../services/patients';
import { isAxiosError } from 'axios';

interface NewHealthCheckEntryProps {
  handleChange: (event: SelectChangeEvent<string[]>) => void,
  entryType: string,
  onEntryAdded: (patient: Patient) => void,
  setSuccess: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  diagnosisCodes: string[],
  patient: Patient,
  diagnosis: Diagnosis[],
  setDiagnosisCodes: React.Dispatch<React.SetStateAction<string[]>>,
  setEntryType: React.Dispatch<React.SetStateAction<string>>
}

const NewHealthCheckEntry = (props: NewHealthCheckEntryProps) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);

  const currentDate = new Date().toISOString().split('T')[0];

  const formStyle = {
    border: 'black',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10x',
    paddingBottom: '50px'
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    let entry: object = {};
    if (props.entryType === 'HealthCheck') {
      entry = {
        description: description,
        date: date,
        specialist: specialist,
        healthCheckRating: healthCheckRating,
        diagnosisCodes: props.diagnosisCodes
      };
    }

    const resetFields = () => {
      setDescription('');
      setDate('');
      setSpecialist('');
      setHealthCheckRating(0);
      props.setDiagnosisCodes([]);
      props.setEntryType('');
    }

    try {
      // Update the patient on PatientPage
      const result = await patientService.addEntry(props.patient, entry);
      props.onEntryAdded(result);
      props.setSuccess('New entry added succesfully');
      resetFields();
    } catch (error: unknown) {
      let errorMessage = 'Error: ';

      if (isAxiosError(error)) {
        errorMessage += error.response?.data;
      }

      props.setError(errorMessage);
    }
  };

  const formWidth = {
    width: '100%'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>New HealthCheck entry</h3>
      <TextField id='description-input' value={description} onChange={({ target }) => setDescription(target.value)}
                style={formWidth} label="Description" variant="standard" />
      <TextField value={specialist} onChange={({ target }) => setSpecialist(target.value)}
                style={formWidth} id="specialist-input" label="Specialist" variant="standard" />
      <InputLabel id="healthcheck-label">Healthcheck rating</InputLabel>
      <Select
        labelId="healthcheck-label"
        id="healthcheck-input"
        value={healthCheckRating}
        onChange={(event) => setHealthCheckRating(event.target.value as number)}
        style={formWidth}
      >
      {Object.values(HealthCheckRating)
        .filter((value) => typeof value === 'number')
        .map((rating) => (
          <MenuItem key={rating} value={rating}>
            {rating}
          </MenuItem>
      ))}
      </Select>
      <div>
        <DiagnosisSelector
          diagnosis={props.diagnosis}
          diagnosisCodes={props.diagnosisCodes}
          handleChange={props.handleChange}
        />
        <TextField
          style={{ marginLeft: '10px', marginTop: '23px', minWidth: '300px' }}
          id="date-input"
          label="Date of entry"
          type="date"
          defaultValue={currentDate}
          onChange={({ target }) => setDate(target.value)}
          InputLabelProps={{
          shrink: true,
          }}
        />
      </div>
      <Button color='success'  type='submit' style={{ minWidth: '1px', display: 'inline-block', float: 'right' }} variant='contained' >add</Button>
    </form>
  )
}

export default NewHealthCheckEntry;