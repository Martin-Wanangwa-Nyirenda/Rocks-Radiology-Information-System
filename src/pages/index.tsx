import {
  Button,
  makeStyles,
  shorthands,
  Title1,
  tokens,
} from "@fluentui/react-components";
import type { NextPage } from "next";
import Head from "next/head";
import TabListComp from "./components/Tablist";
import PatientsTable from "./components/PatientsTable";
import { useState } from "react";
import StudiesTable from "./components/StudiesTable";
import UsersTable from "./components/UsersTable";
import { MenuToolBar } from "./components/Menubar";

// const useStyles = makeStyles({
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     width: "200px",

//     ...shorthands.border("2px", "dashed", tokens.colorPaletteBerryBorder2),
//     ...shorthands.borderRadius(tokens.borderRadiusMedium),
//     ...shorthands.gap("5px"),
//     ...shorthands.padding("10px"),
//   },
// });

const Home: NextPage = () => {
  //const styles = useStyles();
  const [currentTab, setCurrentTab] = useState<string>("0");

  function currentTabHandler(state: any) {
    setCurrentTab(state);
  }

  return (
    <>
      <Head>
        <title>My app</title>
      </Head>

      <div>
        <Title1>Dashboard</Title1>
        <TabListComp currentTabHandler={currentTabHandler} />
        <MenuToolBar />
        {currentTab === "0" && <PatientsTable />}
        {currentTab === "1" && <StudiesTable />}
        {currentTab === "2" && <UsersTable />}
      </div>
    </>
  );
};

export default Home;
