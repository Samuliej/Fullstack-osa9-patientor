import { useState, useEffect } from 'react';
import { Alert, Button, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Patient } from '../../types';
import patientService from '../../services/patients';
import { isAxiosError } from 'axios';

interface NewEntryFormProps {
  patient: Patient;
  onEntryAdded: (patient: Patient) => void;
}

const NewEntryForm = (props: NewEntryFormProps) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [diagnosisCodesString, setDiagnosisCodesString] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [entryType, setEntryType] = useState<string>('');
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStart, setSickLeaveStart] = useState<string>('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [criteria, setCriteria] = useState<string>('');
  const patient = props.patient;

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError('');
      }, 10000)

      return () => clearTimeout(timeout)
    }
  }, [error]);

  const resetFields = () => {
    setDescription('');
    setDate('');
    setSpecialist('');
    setHealthCheckRating(0);
    setDiagnosisCodesString('');
    setEntryType('');
    setEmployerName('');
    setSickLeaveStart('');
    setSickLeaveEnd('');
    setDischargeDate('');
    setCriteria('');
  };

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess('');
      }, 10000)

      return () => clearTimeout(timeout)
    }
  }, [success]);


  const handleDiagnosisCodes = (diagnosisCodes: string): string[] => {
    if (!diagnosisCodes.includes(',')) {
      return [diagnosisCodes];
    }
    const codeArr = diagnosisCodes.split(',');
    console.log('codearr');
    console.log(codeArr);
    return codeArr;
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    let entry: object = {};
    if (entryType === 'HealthCheck') {
      entry = {
        description: description,
        date: date,
        specialist: specialist,
        healthCheckRating: healthCheckRating,
        diagnosisCodes: handleDiagnosisCodes(diagnosisCodesString)
      };
    } else if (entryType === 'OccupationalHealthcare') {
      entry = {
        description: description,
        date: date,
        specialist: specialist,
        employerName: employerName,
        sickLeave: {
          sickLeaveStart: sickLeaveStart,
          sickLeaveEnd: sickLeaveEnd
        },
        diagnosisCodes: handleDiagnosisCodes(diagnosisCodesString)
      };
    } else if (entryType === 'Hospital') {
      entry = {
        description: description,
        date: date,
        specialist: specialist,
        discharge: {
          date: dischargeDate,
          criteria: criteria
        },
        diagnosisCodes: handleDiagnosisCodes(diagnosisCodesString)
      };
    }

    console.log(entry);

    try {
      // Update the patient on PatientPage
      const result = await patientService.addEntry(patient, entry);
      props.onEntryAdded(result);
      setSuccess('New entry added succesfully');
      resetFields();
    } catch (error: unknown) {
      let errorMessage = 'Error: ';

      if (isAxiosError(error)) {
        errorMessage += error.response?.data;
      }

      setError(errorMessage);
    }
  }

  const formWidth = {
    width: '100%'
  };

  return (
    <div>
      {success && (<Alert severity='success'>{success}</Alert>)}
      {error && (<Alert severity='error'>{error}</Alert>)}

      <form onSubmit={handleSubmit} style={{ border: 'black', borderStyle: 'solid', borderRadius: '5px', padding: '10x', paddingBottom: '50px'}}>
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

        {entryType === 'HealthCheck' && (
        <>
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
          <Button color='success'  type='submit' style={{ minWidth: '1px', display: 'inline-block', float: 'right' }} variant='contained' >add</Button>
        </>
        )}

        {entryType === 'OccupationalHealthcare' && (
        <>
          <h3>New Occupational Healthcare entry</h3>
          <TextField id='description-input' value={description} onChange={({ target }) => setDescription(target.value)}
                    style={formWidth} label="Description" variant="standard" />
          <TextField value={date} onChange={({ target }) => setDate(target.value)}
                    style={formWidth} id="date-input" label="Date" variant="standard" />
          <TextField value={specialist} onChange={({ target }) => setSpecialist(target.value)}
                    style={formWidth} id="specialist-input" label="Specialist" variant="standard" />
          <TextField value={employerName} onChange={({ target }) => setEmployerName(target.value)}
                     style={formWidth} id='employer-input' label='Employer' variant='standard' />
          <TextField value={diagnosisCodesString} onChange={({ target }) => setDiagnosisCodesString(target.value)}
                    style={{...formWidth, marginBottom: '10px'}} id="diagnosisCodes-input" label="Diagnosis codes" variant="standard" />
          <TextField value={sickLeaveStart} onChange={({ target }) => setSickLeaveStart(target.value)}
                    style={formWidth} id="sickLeave-start-input" label="Sick leave start" variant="standard" />
          <TextField value={sickLeaveEnd} onChange={({ target }) => setSickLeaveEnd(target.value)}
                    style={formWidth} id="sickLeave-end-input" label="Sick leave end" variant="standard" />
          <Button color='success'  type='submit' style={{ minWidth: '1px', display: 'inline-block', float: 'right' }} variant='contained' >add</Button>
        </>

        )}
        {entryType === 'Hospital' && (
        <>
          <h3>New Hospital entry</h3>
          <TextField id='description-input' value={description} onChange={({ target }) => setDescription(target.value)}
                    style={formWidth} label="Description" variant="standard" />
          <TextField value={date} onChange={({ target }) => setDate(target.value)}
                    style={formWidth} id="date-input" label="Date" variant="standard" />
          <TextField value={specialist} onChange={({ target }) => setSpecialist(target.value)}
                    style={formWidth} id="specialist-input" label="Specialist" variant="standard" />
          <TextField value={diagnosisCodesString} onChange={({ target }) => setDiagnosisCodesString(target.value)}
                    style={{...formWidth, marginBottom: '10px'}} id="diagnosisCodes-input" label="Diagnosis codes" variant="standard" />
          <TextField value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)}
                    style={{...formWidth, marginBottom: '10px'}} id="discharge-date-input" label="Discharge date" variant="standard" />
          <TextField value={criteria} onChange={({ target }) => setCriteria(target.value)}
                    style={{...formWidth, marginBottom: '10px'}} id="criteria-input" label="Criteria" variant="standard" />
          <Button color='success'  type='submit' style={{ minWidth: '1px', display: 'inline-block', float: 'right' }} variant='contained' >add</Button>
        </>
        )}

      </form>
    </div>
  )
};

export default NewEntryForm;