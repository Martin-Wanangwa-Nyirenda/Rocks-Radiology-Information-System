import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
  PresenceBadgeStatus,
  Avatar,
} from "@fluentui/react-components";
import * as React from "react";
import {
  FolderRegular,
  EditRegular,
  OpenRegular,
  DocumentRegular,
  PeopleRegular,
  DocumentPdfRegular,
  VideoRegular,
} from "@fluentui/react-icons";
import { Study } from "@/lib/types";
import { GetStudies } from "@/lib/dcm4che";

const columns = [
  { columnKey: "studyID", label: "Study ID" },
  { columnKey: "patientName", label: "Patient Name" },
  { columnKey: "studyDate", label: "Study Date" },
  { columnKey: "studyTime", label: "Study Time" },
  { columnKey: "studyUID", label: "Study UID" },
  { columnKey: "refPhys", label: "Refering Physician" },
];

const StudiesTable = () => {
  const [data, setData] = React.useState<
    Array<{
      patient_id: { label: string };
      patient_name: { label: string };
      study_id: { label: string };
      study_uid: { label: string };
      study_date: { label: string };
      study_time: { label: string };
      refering_phys: { label: string };
    }>
  >([]);
  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patients = await GetStudies();
        const items = patients.map((item: Study) => ({
          patient_id: { label: item.PatentID },
          patient_name: { label: item.PatientName },
          study_id: { label: item.StudyID },
          study_uid: { label: item.StudyUID },
          study_date: { label: item.StudyDate },
          study_time: { label: item.StudyTime },
          refering_phys: { label: item.ReferringPhys },
        }));
        setData(items);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Table arial-label="Default table">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column.columnKey}>
              {column.label}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.study_id.label}>
            <TableCell>{item.study_id.label}</TableCell>
            <TableCell>{item.patient_name.label}</TableCell>
            <TableCell>{item.study_date.label}</TableCell>
            <TableCell>{item.study_time.label}</TableCell>
            <TableCell>{item.study_uid.label}</TableCell>
            <TableCell>{item.refering_phys.label}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudiesTable;
