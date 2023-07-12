import { Select, OutlinedInput, MenuItem, Checkbox, ListItemText, SelectChangeEvent } from "@mui/material";
import { Diagnosis } from "../../types";

interface DiagnosisSelectorProps {
  diagnosisCodes: string[],
  handleChange: (event: SelectChangeEvent<string[]>) => void,
  diagnosis: Diagnosis[]
};

const DiagnosisSelector = (props: DiagnosisSelectorProps) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <div>
      <Select
        style={{ minWidth: '300px' }}
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={props.diagnosisCodes}
        onChange={props.handleChange}
        input={<OutlinedInput label="Diagnosis codes" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {props.diagnosis.map((diagnose) => (
          <MenuItem key={diagnose.code} value={diagnose.code}>
            <Checkbox checked={props.diagnosisCodes.indexOf(diagnose.code) > -1} />
            <ListItemText primary={diagnose.code} />
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default DiagnosisSelector;