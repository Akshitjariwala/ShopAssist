//! Ant Imports

import Layout from "antd/lib/layout";

//! User Files

import AppHeader from "./components/header/AppHeader";
import AppSidebar from "./components/sidebar/AppSidebar";
import AppFooter from "./components/footer/AppFooter";
import ContentRoutes from "./ContentRoutes";
import "./App.less";

const { Content } = Layout;

const App = () => {
  return (
    <Layout className="app-layout">
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content className="app-content">
          <div className="app-content-wrapper">
            <ContentRoutes />
          </div>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default App;
