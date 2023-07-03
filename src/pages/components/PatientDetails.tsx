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

import { EditRegular } from "@fluentui/react-icons";
import * as React from "react";
import { SelectGender } from "./CreatePatientFormComps/SelectGender";
import { SelectBirthDate } from "./CreatePatientFormComps/SelectBirthDate";
import { getLastPatientId, createPatient, GetPatientByID } from "@/lib/dcm4che";
import { Patient } from "@/lib/types";
import { Appointment } from "./CreatePatientFormComps/Appointment";
import { parse, format } from "date-fns";
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
  DocumentSnapshot,
} from "firebase/firestore";

const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
});
type PatientDetailsProps = {
  patientID: string;
};
export default function PatientDetails(props: PatientDetailsProps) {
  const styles = useStyles();
  const [patientName, setPatientName] = React.useState("");
  const [patientSex, setPatientSex] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [modality, setModality] = React.useState("");
  const [imaging_day, setImaging_Day] = React.useState("");
  const [patientDataReady, setPatientDataReady] = React.useState(false);
  const [fetchedPatientData, setFetchedPatientData] =
    React.useState<DocumentData>({});
  const [appointment, setAppointment] = React.useState<
    DocumentData | { imagingDay: string; modality: string }
  >({ imagingDay: " ", modality: " " });

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const processFormSubmission = async () => {
      const patient: Patient = {
        name: patientName,
        DOB: birthDate,
        sex: patientSex,
        ID: props.patientID,
      };

      const res = await createPatient(patient, imaging_day, modality);
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
  function handlerModality(modality: string) {
    setModality(modality);
  }
  function handlerImagingDate(imagingDate: string) {
    setImaging_Day(imagingDate);
  }
  async function fetchData() {
    const data = await GetPatientByID(props.patientID);
    setFetchedPatientData(data);
    setPatientDataReady(true);
  }

  async function fetchAppointment(docRef: DocumentReference) {
    try {
      const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
      const data: DocumentData | undefined = docSnap.data();

      if (!data) {
        throw new Error("Document data not found");
      }

      setAppointment(data);
    } catch (error) {
      throw error;
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (patientDataReady === true) {
      console.log("The data: " + fetchedPatientData.appointment);
      fetchAppointment(fetchedPatientData.appointment);
    }
  }, [patientDataReady]);

  const parseDate = (dateString: string): Date => {
    const parsedDate = parse(dateString, "d-M-yyyy", new Date());
    return parsedDate;
  };
  return (
    <Dialog modalType="non-modal">
      <DialogTrigger disableButtonEnhancement>
        <Button icon={<EditRegular />} aria-label="Edit" />
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>Patient {props.patientID}</DialogTitle>
            <DialogContent className={styles.content}>
              <Label required htmlFor={"name-input"}>
                Full Name
              </Label>
              <Input
                required
                type="text"
                value={fetchedPatientData.name}
                id={"name-input"}
                onChange={(e) => {
                  setPatientName(e.target.value);
                }}
              />
              <SelectGender
                handlerSetSex={handlerSetSex}
                value={fetchedPatientData.sex}
              />
              <SelectBirthDate
                handlerBirthDate={handlerBirthDate}
                dateValue={parseDate(fetchedPatientData.DOB)}
              />
              <Label size="large" htmlFor={"appointments"}>
                Appointments
              </Label>
              <Appointment
                handlerImagingDate={handlerImagingDate}
                handlerModality={handlerModality}
                imagingDateValue={parseDate(appointment.imagingDay)}
                modalityValue={appointment.modality}
              />
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
