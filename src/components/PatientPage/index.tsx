import { useParams } from "react-router-dom";
import { Patient, Diagnosis , Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from "../../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useState, useEffect } from 'react';
import diagnoseService from '../../services/diagnoses';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import NewEntryForm from "./NewEntryForm";

const entryStyle = {
  border: '2px',
  borderStyle: 'solid',
  borderRadius: '5px',
  marginBottom: '3px',
  padding: '2px'
};


interface PatientProps {
  patients: Patient[]
}

interface HospitalProps {
  details: HospitalEntry;
  diagnoses: Diagnosis[];
}

interface OccupationalProps {
  details: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}

interface HealthProps {
  details: HealthCheckEntry;
  diagnoses: Diagnosis[];
}

interface DiagnosisProps {
  diagnosisCodes: string[];
  diagnoses: Diagnosis[];
}


const DiagnosisList = (props: DiagnosisProps) => {
  if (props.diagnosisCodes.length === 0 || props.diagnosisCodes[0] === '') {
    return null;
  }

  return (
    <div>
      <ul>
      {props.diagnosisCodes.map(code =>
            <li key={code}>{code} {props.diagnoses.map(diagnose => diagnose.code === code
            ? diagnose.name : null)}
            </li>
          )}
      </ul>
    </div>
  )
}

const HealthEntryView = (props: HealthProps) => {
  const healthRate: number = props.details.healthCheckRating;

  return (
    <div style={entryStyle}>
      {props.details.date} <MonitorHeartIcon />
      <p><em>{props.details.description}</em></p>
      {props.details.diagnosisCodes &&
        <DiagnosisList diagnosisCodes={props.details.diagnosisCodes} diagnoses={props.diagnoses} />
      }
      {healthRate === 0 && <p>❤️️</p>}
      {healthRate === 1 && <p>🧡</p>}
      {healthRate === 2 && <p>💜</p>}
      {healthRate === 3 && <p>🖤</p>}
      <p>diagnose by: <strong>{props.details.specialist}</strong></p>
    </div>
  )
}

const OccupationalEntryView = (props: OccupationalProps) => {
  return (
    <div style={entryStyle}>
      {props.details.date} <WorkIcon /> {props.details.employerName}
      <p><em>{props.details.description}</em></p>
      {props.details.diagnosisCodes &&
        <DiagnosisList diagnosisCodes={props.details.diagnosisCodes} diagnoses={props.diagnoses} />
      }
      {props.details.sickLeave &&
        <p>Sick Leave from: {props.details.sickLeave?.startDate} to: {props.details.sickLeave?.endDate}</p>
      }

      <p>diagnose by: <strong>{props.details.specialist}</strong></p>
    </div>
  )
}

const HospitalEntryView = (props: HospitalProps) => {
  return (
    <div style={entryStyle}>
      {props.details.date} <LocalHospitalIcon />
      <p><em>{props.details.description}</em></p>
      {props.details.diagnosisCodes &&
        <DiagnosisList diagnosisCodes={props.details.diagnosisCodes} diagnoses={props.diagnoses} />
      }
      <p>diagnose by: <strong>{props.details.specialist}</strong></p>
      <p>date discharged: {props.details.discharge.date} Criteria: {props.details.discharge.criteria} 🏠</p>
    </div>
  )
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryListing: React.FC<{entry: Entry; diagnoses: Diagnosis[]}> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryView details={entry} diagnoses={diagnoses}/>
    case 'OccupationalHealthcare':
      return <OccupationalEntryView details={entry} diagnoses={diagnoses}/>
    case 'HealthCheck':
      return <HealthEntryView details={entry} diagnoses={diagnoses}/>
    default:
      return assertNever(entry);
  }
};

const PatientPage = (props: PatientProps) => {
  const id = useParams().id;
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    setPatient(props.patients.find(p => p.id === id));
  }, [props.patients, id]);

  useEffect(() => {
    const fetchDiagnoseList = async () => {
      const patients = await diagnoseService.getAll();
      setDiagnoses(patients);
    };
    void fetchDiagnoseList();
  }, [diagnoses]);

  const handleEntryAdded = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
  }

  return (
    <div>
      <h2>
        {patient?.name}
        {patient?.gender === 'male' && <MaleIcon />}
        {patient?.gender === 'female' && <FemaleIcon />}
      </h2>
      <p>ssn: {patient?.ssn} </p>
      <p>occupation: {patient?.occupation}</p>

      <div style={{ marginBottom: '10px' }}>
        {patient && <NewEntryForm diagnosis={diagnoses} patient={patient} onEntryAdded={handleEntryAdded}/>}
      </div>

      <h3>entries</h3>
      {patient?.entries.map(entry => <EntryListing key={entry.id} entry={entry} diagnoses={diagnoses} />)}

    </div>
  )
};

export default PatientPage;