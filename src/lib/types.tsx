export type TablistCompProps = {
  currentTabHandler: (state: any) => void;
};

export type Patient = {
  name: string;
  DOB: string;
  imagingDay: string;
  sex: string;
  ID: any;
};

export type Study = {
  StudyDate: string;
  StudyTime: string;
  StudyUID: string;
  StudyID: string;
  PatientName: string;
  ReferringPhys: string;
  StudyDescr: string;
  PatientID: string; // Corrected property name
};
