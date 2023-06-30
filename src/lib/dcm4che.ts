import { db } from "@/lib/firebase";
import {
  collection,
  query,
  doc,
  setDoc,
  orderBy,
  limit,
  getDocs,
  getDoc,
  DocumentReference
} from "firebase/firestore";
import { v4 } from 'uuid';
import { Patient, Study } from "./types";
import { dataGridBodyClassNames } from "@fluentui/react-components";

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function createPatient(patient: Patient, appointment?: string, modality?: string) {
  const appointment_ = appointment ?? " "; 
  const modality_ = modality ?? " ";
  let final = "Operation wasn't successfully";
  const name = patient.name.replace(" ", "^");
  const patientDICOMObj = {
    "00100010": {
      vr: "PN",
      Value: [
        {
          Alphabetic: name,
        },
      ],
    },
    "00100020": {
      vr: "LO",
      Value: [`${patient.ID}`],
    },
    "00100030": {
      vr: "DA",
      Value: [`${patient.DOB}`],
    },
    "00100040": {
      vr: "CS",
      Value: [`${patient.sex}`],
    },
  };

  postData(
    `http://${process.env.NEXT_PUBLIC_HOST}:8080/dcm4chee-arc/aets/DCM4CHEE/rs/patients`,
    patientDICOMObj
  )
    .then(async () => {
      if(appointment_ && modality_){
      const appointmentRef = await createAppointment(appointment_, modality_)

      await setDoc(doc(db, "patients", patient.ID), {
        name: patient.name,
        DOB: patient.DOB,
        appointment: appointmentRef,
        createdAt: Date.now().toLocaleString(),
        sex: patient.sex,
      }).then(() => (final = "success"));
    }else{
      throw new Error("Appointment and Modality not defined")
    }

    })
    .catch((error) => {
      console.error(error);
      final = "failed";
    });

  return final;
}

export async function createAppointment(date: string, modality: string): Promise<DocumentReference>{
  const id = v4()
  const appointmentRef = doc(db, "appointments", id);
  await setDoc(appointmentRef, {
   imagingDay: date,
   modality: modality
  })
  return appointmentRef;
}

export async function getLastPatientId(
  collectionName: string
): Promise<Number> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, orderBy("name", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const lastItem = querySnapshot.docs[0];
      const lastItemId = lastItem.id;
      const lastItemIdNumber = parseInt(lastItemId) + 1;
      return lastItemIdNumber;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error getting last item:", error);
    throw error;
  }
}

export async function GetPatients(num?: Number): Promise<Patient[]> {
  try {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_HOST}:8080/dcm4chee-arc/aets/DCM4CHEE/rs/patients`,
      {
        headers: {
          Accept: "application/dicom+json", // Specify the desired content type here
        },
      }
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();

    const patientsFetched = data.map((item: any) => {
      const name = item["00100010"].Value[0].Alphabetic.replace("^", " ");
      const ID = item["00100020"].Value[0];
      const DOB = item["00100030"].Value[0];
      const sex = item["00100040"].Value[0];

      return {
        name,
        DOB,
        sex,
        ID,
      };
    });

    return patientsFetched;
  } catch (error) {
    console.error(error);
    return []; // Return an empty array or handle the error according to your needs
  }
}

export async function GetStudies(num?: number): Promise<Study[]> {
  try {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_HOST}:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies`,
      {
        headers: {
          Accept: "application/dicom+json", // Specify the desired content type here
        },
      }
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data: any[] = await response.json(); // Expect an array of objects

    const studies: Study[] = data.map((item: any) => {
      const StudyDate = item["00080020"].Value[0];
      const StudyTime = item["00080030"].Value[0];
      const StudyUID = item["0020000D"].Value[0];
      const StudyID = item["00200010"].Value[0];
      const PatientName = item["00100010"].Value[0].Alphabetic.replace(
        "^",
        " "
      );
      const ReferringPhys = item["00080090"].Value[0].Alphabetic.replace(
        "^",
        " "
      );
      const StudyDescr = item["00080201"].Value?.[0];
      const PatientID = item["00100020"].Value[0];

      return {
        StudyDate,
        StudyTime,
        StudyUID,
        StudyID,
        PatientName,
        ReferringPhys,
        StudyDescr,
        PatientID, // Corrected property name
      };
    });

    return studies;
  } catch (error) {
    console.error(error);
    return []; // Return an empty array or handle the error according to your needs
  }
}

export async function GetPatientFromFirebase(num?: number) {
  try {
    const collectionRef = collection(db, 'patients');
    const querySnapshot = await getDocs(collectionRef);

    const data: { name: string; DOB: string; sex: string; ID: string, imagingDay: string }[] = [];

    querySnapshot.forEach((doc) => {
      const patient = doc.data();
      const patientWithID = {
        name: patient.name,
        DOB: patient.DOB,
        sex: patient.sex,
        ID: doc.id,
        imagingDay: patient.imagingDay
      };
      data.push(patientWithID);
    });

    const filteredData = data.map((patient) => ({
      name: patient.name,
      DOB: patient.DOB,
      sex: patient.sex,
      ID: patient.ID,
      imagingDay: patient.imagingDay
    }));

    return filteredData;
  } catch (error) {
    // Handle the error appropriately
    console.error('Error getting patient data:', error);
    throw error;
  }
}

export async function GetPatientByID(id: string){
  const docRef = doc(db, "patients", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Patient does not exist.")
  }
}