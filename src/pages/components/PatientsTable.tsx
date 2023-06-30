import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Button,
  TableCellLayout,
  useArrowNavigationGroup,
  useFocusableGroup,
} from "@fluentui/react-components";
import {
  EditRegular,
  CalendarMonthRegular,
  DeleteRegular
} from "@fluentui/react-icons";
import * as React from "react";
import { GetPatients, GetPatientFromFirebase } from "@/lib/dcm4che";
import { Patient } from "@/lib/types";
import { MenuToolBar } from "./Menubar";

const columns = [
  { columnKey: "patientID", label: "Patient ID" },
  { columnKey: "name", label: "Name" },
  { columnKey: "sex", label: "Sex" },
  { columnKey: "birthDate", label: "Birth Date" },
  { columnKey: "imagingDay", label: "Imaging Day" },
];

const PatientsTable = () => {

  const keyboardNavAttr = useArrowNavigationGroup({ axis: "grid" });
  const focusableGroupAttr = useFocusableGroup({
    tabBehavior: "limited-trap-focus",
  });
  const [data, setData] = React.useState<
    Array<{
      patient_id: { label: string };
      patient_name: { label: string };
      patient_dob: { label: string };
      patient_imaging_day: { label: string };
      patient_sex: { label: string };
    }>
  >([]);

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patients = await GetPatientFromFirebase();
        const items = patients.map((item: Patient) => ({
          patient_id: { label: item.ID },
          patient_name: { label: item.name },
          patient_dob: { label: item.DOB },
          patient_imaging_day: { label: "12-01-2023"},
          patient_sex: { label: item.sex },
        }));
        setData(items);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);
  return (
    <>
      <MenuToolBar />
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
            <TableRow key={item.patient_id.label}>
              <TableCell>{item.patient_id.label}</TableCell>
              <TableCell>{item.patient_name.label}</TableCell>
              <TableCell>{item.patient_sex.label}</TableCell>
              <TableCell>{item.patient_dob.label}</TableCell>
              <TableCell>{item.patient_imaging_day.label}</TableCell>
              <TableCell role="gridcell" tabIndex={0} {...focusableGroupAttr}>
              <TableCellLayout>
                <Button icon={<EditRegular />} aria-label="Edit" />
              </TableCellLayout>
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PatientsTable;
