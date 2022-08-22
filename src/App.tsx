import React, { FC, useState } from "react";
import "./App.css";
import { UsersList, FileUploadPage } from "./page";

import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Header, Sider, Content } = Layout;

export const App: FC = () => {
  const [upload, setUpload] = useState(false);
  return (
    <Layout className="App">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" onClick={() => setUpload(true)}>
            <UserOutlined />
            <span>List</span>
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setUpload(true)}>
            <UploadOutlined />
            <span>Upload</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header>{upload && <FileUploadPage />}</Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <h1>MVP employee salary management</h1>

          <br />
          <UsersList />
        </Content>
      </Layout>
    </Layout>
  );
};
