import { useParams } from "react-router-dom";
import { Patient } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';


interface PatientProps {
  patients: Patient[]
}

const PatientPage = (props: PatientProps) => {
  const id = useParams().id;
  const patient = props.patients.find(p => p.id === id);

  return (
    <div>
      <h2>
        {patient?.name}
        {patient?.gender === 'male' && <MaleIcon />}
        {patient?.gender === 'female' && <FemaleIcon />}
      </h2>
      <p>ssn: {patient?.ssn} </p>
      <p>occupation: {patient?.occupation}</p>
    </div>
  )
}

export default PatientPage;