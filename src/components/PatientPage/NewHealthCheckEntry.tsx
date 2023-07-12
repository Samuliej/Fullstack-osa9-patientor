import { useState } from 'react';
import { TextField, InputLabel, Button, SelectChangeEvent } from "@mui/material";
import DiagnosisSelector from "./DiagnosisSelector";
import { Patient, Diagnosis } from '../../types';
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
      <TextField value={date} onChange={({ target }) => setDate(target.value)}
                style={formWidth} id="date-input" label="Date" variant="standard" />
      <TextField value={specialist} onChange={({ target }) => setSpecialist(target.value)}
                style={formWidth} id="specialist-input" label="Specialist" variant="standard" />
      <TextField value={healthCheckRating} onChange={({ target }) => setHealthCheckRating(Number(target.value))}
                style={formWidth} id="healthcheck-input" label="Healthcheck rating" variant="standard" />
      <InputLabel id="demo-multiple-checkbox-label">Diagnosis codes</InputLabel>
      <DiagnosisSelector
        diagnosis={props.diagnosis}
        diagnosisCodes={props.diagnosisCodes}
        handleChange={props.handleChange}
      />
      <Button color='success'  type='submit' style={{ minWidth: '1px', display: 'inline-block', float: 'right' }} variant='contained' >add</Button>
    </form>
  )
}

export default NewHealthCheckEntry;