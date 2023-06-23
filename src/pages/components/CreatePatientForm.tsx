import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Input,
  Label,
  makeStyles,
  ToolbarButton,
} from "@fluentui/react-components";

import { PeopleAdd24Regular } from "@fluentui/react-icons";
import * as React from "react";
import { SelectGender } from "./CreatePatientFormComps/SelectGender";
import { SelectBirthDate } from "./CreatePatientFormComps/SelectBirthDate";
import { getLastPatientId, createPatient } from "@/lib/dcm4che";
import { Patient } from "@/lib/types";

const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
});

export default function CreatePatientForm() {
  const styles = useStyles();
  const [patientName, setPatientName] = React.useState("");
  const [patientSex, setPatientSex] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const processFormSubmission = async () => {
      const patient_id = await getLastPatientId("patients");

      const patient: Patient = {
        name: patientName,
        DOB: birthDate,
        imagingDay: "12-06-2023",
        sex: patientSex,
        ID: patient_id.toString(),
      };

      const res = await createPatient(patient);
      console.log(res);
      alert(`Name: ${patientName} Sex: ${patientSex} DOB: ${birthDate}`);
    };

    await processFormSubmission();
  };

  function handlerSetSex(patient_sex: string) {
    setPatientSex(patient_sex);
  }
  function handlerBirthDate(patient_dob: string) {
    setBirthDate(patient_dob);
  }
  return (
    <Dialog modalType="non-modal">
      <DialogTrigger disableButtonEnhancement>
        <ToolbarButton appearance="primary">
          <PeopleAdd24Regular />
        </ToolbarButton>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>Create New Patient</DialogTitle>
            <DialogContent className={styles.content}>
              <Label required htmlFor={"name-input"}>
                Full Name
              </Label>
              <Input
                required
                type="text"
                id={"name-input"}
                onChange={(e) => {
                  setPatientName(e.target.value);
                }}
              />
              <SelectGender handlerSetSex={handlerSetSex} />
              <SelectBirthDate handlerBirthDate={handlerBirthDate} />
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
              <Button type="submit" appearance="primary">
                Submit
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
