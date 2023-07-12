import { useState, useEffect } from 'react';
import { Alert, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import { Patient, Diagnosis } from '../../types';
import NewHealthCheckEntry from './NewHealthCheckEntry';
import NewOccupationalHealthcareEntry from './NewOccupationalHealthcareEntry';
import NewHospitalEntry from './NewHospitalEntry';

// Using react redux would propably be better than passing props a lot, but I'm sticking with this now

interface NewEntryFormProps {
  patient: Patient;
  onEntryAdded: (patient: Patient) => void;
  diagnosis: Diagnosis[];
}

const NewEntryForm = (props: NewEntryFormProps) => {
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [entryType, setEntryType] = useState<string>('');


  const patient = props.patient;

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError('');
      }, 10000)

      return () => clearTimeout(timeout)
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess('');
      }, 10000)

      return () => clearTimeout(timeout)
    }
  }, [success]);


  const handleChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const formWidth = {
    width: '100%'
  };

  return (
    <div>
        <h3>New Entry</h3>
        <FormControl style={formWidth}>
          <InputLabel id="entry-type-label">Entry Type</InputLabel>
          <Select
            labelId="entry-type-label"
            id="entry-type-select"
            value={entryType}
            onChange={(event) => setEntryType(event.target.value as string)}
          >
            <MenuItem value="">Select an Entry Type</MenuItem>
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
          </Select>
        </FormControl>

        {success && (<Alert severity='success'>{success}</Alert>)}
        {error && (<Alert severity='error'>{error}</Alert>)}

        {entryType === 'HealthCheck' && (
          <NewHealthCheckEntry
            handleChange={handleChange}
            entryType={entryType}
            onEntryAdded={props.onEntryAdded}
            setSuccess={setSuccess}
            setError={setError}
            diagnosisCodes={diagnosisCodes}
            patient={patient}
            diagnosis={props.diagnosis}
            setDiagnosisCodes={setDiagnosisCodes}
            setEntryType={setEntryType}
          />
        )}
        {entryType === 'OccupationalHealthcare' && (
         <NewOccupationalHealthcareEntry
            handleChange={handleChange}
            entryType={entryType}
            onEntryAdded={props.onEntryAdded}
            setSuccess={setSuccess}
            setError={setError}
            diagnosisCodes={diagnosisCodes}
            patient={patient}
            diagnosis={props.diagnosis}
            setDiagnosisCodes={setDiagnosisCodes}
            setEntryType={setEntryType}
          />
        )}
        {entryType === 'Hospital' && (
          <NewHospitalEntry
            handleChange={handleChange}
            entryType={entryType}
            onEntryAdded={props.onEntryAdded}
            setSuccess={setSuccess}
            setError={setError}
            diagnosisCodes={diagnosisCodes}
            patient={patient}
            diagnosis={props.diagnosis}
            setDiagnosisCodes={setDiagnosisCodes}
            setEntryType={setEntryType}
          />
        )}
    </div>
  )
};

export default NewEntryForm;