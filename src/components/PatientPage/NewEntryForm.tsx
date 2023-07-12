import { useState, useEffect } from 'react';
import { Alert, Button, TextField } from '@mui/material';
import { Patient } from '../../types';
import patientService from '../../services/patients';
import { isAxiosError } from 'axios';

interface NewEntryFormProps {
  patient: Patient;
  onEntryAdded: (patient: Patient) => void;
}

const NewEntryForm = (props: NewEntryFormProps) => {
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [diagnosisCodesString, setDiagnosisCodesString] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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


  const handleDiagnosisCodes = (diagnosisCodes: string): string[] => {
    const codeArr = diagnosisCodes.split(',');
    return codeArr;
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const entry: object = {
      description: description,
      date: date,
      specialist: specialist,
      healthCheckRating: healthCheckRating,
      diagnosisCodes: handleDiagnosisCodes(diagnosisCodesString)
    };

    try {
      // Update the patient on PatientPage
      const result = await patientService.addEntry(patient, entry);
      props.onEntryAdded(result);
      setSuccess('New entry added succesfully');
    } catch (error: unknown) {
      let errorMessage = 'Error: ';

      if (isAxiosError(error)) {
        errorMessage += error.response?.data;
      }

      setError(errorMessage);
    }
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  };

  const formWidth = {
    width: '100%'
  };

  return (
    <div>
      {success && (<Alert severity='success'>{success}</Alert>)}
      {error && (<Alert severity='error'>{error}</Alert>)}
      {
        !visible && <Button onClick={toggleVisibility} style={{ marginBottom: '2px' }} variant="contained">add new entry</Button>
      }
      {visible && (
        <form onSubmit={handleSubmit} style={{...formWidth, border: 'black', borderStyle: 'solid', borderRadius: '5px', padding: '10px'}}>
          <h3>New HealthCheck entry</h3>
          <TextField id='description-input' value={description} onChange={({ target }) => setDescription(target.value)}
                    style={formWidth} label="Description" variant="standard" />
          <TextField value={date} onChange={({ target }) => setDate(target.value)}
                    style={formWidth} id="date-input" label="Date" variant="standard" />
          <TextField value={specialist} onChange={({ target }) => setSpecialist(target.value)}
                    style={formWidth} id="specialist-input" label="Specialist" variant="standard" />
          <TextField value={healthCheckRating} onChange={({ target }) => setHealthCheckRating(Number(target.value))}
                    style={formWidth} id="healthcheck-input" label="Healthcheck rating" variant="standard" />
          <TextField value={diagnosisCodesString} onChange={({ target }) => setDiagnosisCodesString(target.value)}
                    style={{...formWidth, marginBottom: '10px'}} id="diagnosisCodes-input" label="Diagnosis codes" variant="standard" />
          <Button onClick={toggleVisibility} style={{ display: 'inline-block' }} variant="contained" color="error">Cancel</Button>
          <Button color='success'  type='submit' style={{ minWidth: '1px', display: 'inline-block', float: 'right' }} variant='contained' >add</Button>
        </form>
      )}
    </div>
  )
};

export default NewEntryForm;