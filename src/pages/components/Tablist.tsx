import {
  makeStyles,
  shorthands,
  Tab,
  TabList,
  SelectTabData,
  SelectTabEvent,
} from "@fluentui/react-components";
import * as React from "react";
import { TablistCompProps } from "@/lib/types";

const useStyles = makeStyles({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...shorthands.padding("15px", "20px"),
    rowGap: "20px",
  },
});

const TabListComp = (props: TablistCompProps) => {
  const styles = useStyles();

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    props.currentTabHandler(data.value);
  };

  return (
    <div className={styles.root}>
      <TabList onTabSelect={onTabSelect} defaultSelectedValue="0">
        <Tab value="0">Patients</Tab>
        <Tab value="1">Studies</Tab>
        <Tab value="2">Users</Tab>
        <Tab value="3">Settings</Tab>
      </TabList>
    </div>
  );
};

export default TabListComp;
