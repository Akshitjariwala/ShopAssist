import React from "react";
import { Button } from "antd";
import Layout from "antd/lib/layout";
import { ROUTES } from "common/constants";
const { Header } = Layout;

const AppHeader = () => {
  const handleLogout = () => {
    window.location.href = ROUTES.LOGOUT;
  };
  return (
    <Header className="acc-header">
      <div>SHOP ASSIST</div>
      <Button onClick={handleLogout}>Logout</Button>
    </Header>
  );
};

export default AppHeader;
