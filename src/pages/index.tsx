import { Title1 } from "@fluentui/react-components";
import type { NextPage } from "next";
import Head from "next/head";
import TabListComp from "./components/Tablist";
import PatientsTable from "./components/PatientsTable";
import { useState } from "react";
import StudiesTable from "./components/StudiesTable";
import UsersTable from "./components/UsersTable";

const Home: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<string>("0");

  function currentTabHandler(state: any) {
    setCurrentTab(state);
  }

  return (
    <>
      <Head>
        <title>My app</title>
      </Head>
      {/* w-90 is a custom value */}
      <div className="m-auto w-90 h-full h-screen">
        <Title1>Dashboard</Title1>
        <TabListComp currentTabHandler={currentTabHandler} />
        {currentTab === "0" && <PatientsTable />}
        {currentTab === "1" && <StudiesTable />}
        {currentTab === "2" && <UsersTable />}
      </div>
    </>
  );
};

export default Home;
