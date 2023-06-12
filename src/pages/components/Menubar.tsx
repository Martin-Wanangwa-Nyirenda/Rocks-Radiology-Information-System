import {
  Toolbar,
  ToolbarButton,
  ToolbarProps,
} from "@fluentui/react-components";
import * as React from "react";
import {
  FontIncrease24Regular,
  FontDecrease24Regular,
  TextFont24Regular,
} from "@fluentui/react-icons";
import { createPatient } from "@/lib/dcm4che";
import { Patient } from "@/lib/types";

async function createPatientHandler() {
  const patient: Patient = {
    name: "Martin Nyirenda",
    DOB: "12-01-2020",
    imagingDay: "12-06-2023",
    sex: "M",
    ID: "45333",
  };
  const res = await createPatient(patient);
  console.log(res);
}

export const MenuToolBar = (props: Partial<ToolbarProps>) => (
  <Toolbar
    {...props}
    aria-label="Medium"
    size="medium"
    style={{
      border: "2px solid black",
      borderRadius: "8px",
    }}
  >
    <ToolbarButton
      aria-label="Increase Font Size"
      appearance="primary"
      icon={<FontIncrease24Regular />}
      onClick={() => {
        createPatientHandler();
      }}
    />
    <ToolbarButton
      aria-label="Decrease Font Size"
      icon={<FontDecrease24Regular />}
    />
    <ToolbarButton aria-label="Reset Font Size" icon={<TextFont24Regular />} />
  </Toolbar>
);
