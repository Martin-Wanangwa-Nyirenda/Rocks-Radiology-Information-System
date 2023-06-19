import { db } from "@/lib/firebase";
import {
  collection,
  query,
  doc,
  setDoc,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { Patient } from "./types";

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

export async function createPatient(patient: Patient) {
  let final = "Nothing happened";
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
      await setDoc(doc(db, "patients", patient.ID), {
        name: patient.name,
        DOB: patient.DOB,
        imagingDay: patient.imagingDay,
        createdAt: Date.now().toLocaleString(),
        sex: patient.sex,
      }).then(() => (final = "success"));
    })
    .catch((error) => {
      console.error(error);
      final = "failed";
    });

  return final;
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
