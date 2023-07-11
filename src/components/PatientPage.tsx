import { useParams } from "react-router-dom";
import { Patient, Diagnosis } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useState, useEffect } from 'react';
import diagnoseService from '../services/diagnoses';


interface PatientProps {
  patients: Patient[]
}

const PatientPage = (props: PatientProps) => {
  const id = useParams().id;
  const patient = props.patients.find(p => p.id === id);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])

  useEffect(() => {
    const fetchDiagnoseList = async () => {
      const patients = await diagnoseService.getAll();
      setDiagnoses(patients);
    };
    void fetchDiagnoseList();
  }, [diagnoses])

  return (
    <div>
      <h2>
        {patient?.name}
        {patient?.gender === 'male' && <MaleIcon />}
        {patient?.gender === 'female' && <FemaleIcon />}
      </h2>
      <p>ssn: {patient?.ssn} </p>
      <p>occupation: {patient?.occupation}</p>
      <h3>entries</h3>
      {patient?.entries.map(entry => {
        return (
          <div key={entry.id}>
           <p key={entry.id}>{entry.date} {entry.description}</p>
           <ul>
            {entry.diagnosisCodes?.map(code =>
              <li key={code}>{code} {diagnoses.map(diagnose => diagnose.code === code
              ? diagnose.name : null)}
              </li>
            )}
           </ul>
          </div>
      )})}
    </div>
  )
}

export default PatientPage;