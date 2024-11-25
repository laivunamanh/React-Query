import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const menuItems = [
  { key: "home", label: <Link to="/home">Home</Link> },
  { key: "products", label: <Link to="/products">Sản phẩm</Link> },
//   { key: "details", label: <Link to="/details">Chi tiết</Link> },
  { key: "cart", label: <Link to="/cart">Giỏ hàng</Link> },
  { key: "register", label: <Link to="/register">Đăng ký</Link> },
  { key: "login", label: <Link to="/login">Đăng nhập</Link> },
];

const LayoutHome: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["home"]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LayoutHome;
