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
import CreatePatientForm from "./CreatePatientForm";

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
    <CreatePatientForm />
    <ToolbarButton aria-label="Reset Font Size" icon={<TextFont24Regular />} />
  </Toolbar>
);
