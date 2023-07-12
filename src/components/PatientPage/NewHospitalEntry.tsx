import { useState } from 'react';
import { TextField, Button, SelectChangeEvent } from "@mui/material";
import DiagnosisSelector from "./DiagnosisSelector";
import { Patient, Diagnosis } from '../../types';
import patientService from '../../services/patients';
import { isAxiosError } from 'axios';

interface NewHospitalEntryProps {
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

const NewHospitalEntry = (props: NewHospitalEntryProps) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [criteria, setCriteria] = useState<string>('');

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
    if (props.entryType === 'Hospital') {
      entry = {
        description: description,
        date: date,
        specialist: specialist,
        discharge: {
          date: dischargeDate,
          criteria: criteria
        },
        diagnosisCodes: props.diagnosisCodes
      };
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

  const resetFields = () => {
    setDescription('');
    setDate('');
    setSpecialist('');
    setDischargeDate('');
    setCriteria('');
    props.setDiagnosisCodes([]);
    props.setEntryType('');
  }

  const formWidth = {
    width: '100%'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>New Hospital entry</h3>
      <TextField id='description-input' value={description} onChange={({ target }) => setDescription(target.value)}
                style={formWidth} label="Description" variant="standard" />
      <TextField value={specialist} onChange={({ target }) => setSpecialist(target.value)}
                style={formWidth} id="specialist-input" label="Specialist" variant="standard" />
      <TextField value={criteria} onChange={({ target }) => setCriteria(target.value)}
                style={{...formWidth, marginBottom: '10px'}} id="criteria-input" label="Criteria" variant="standard" />

      <div>
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
        <TextField
          style={{ marginLeft: '10px', marginTop: '23px', minWidth: '300px' }}
          id="discharge-date-input"
          label="Discharge date"
          type="date"
          defaultValue={currentDate}
          onChange={({ target }) => setDischargeDate(target.value)}
          InputLabelProps={{
          shrink: true,
          }}
        />
      </div>

      <div style={{ marginLeft: '10px' }}>
        <DiagnosisSelector
          diagnosis={props.diagnosis}
          diagnosisCodes={props.diagnosisCodes}
          handleChange={props.handleChange}
        />
      </div>
      <Button color='success'  type='submit' style={{ minWidth: '1px', display: 'inline-block', float: 'right' }} variant='contained' >add</Button>
    </form>
  )
}

export default NewHospitalEntry;