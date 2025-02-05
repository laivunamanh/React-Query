import React from "react";
import { Breadcrumb, Col, Layout, Menu, Row, theme } from "antd";
import { Outlet, Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;
import "./Footer.scss";
import { HomeOutlined, LoginOutlined, OpenAIOutlined, ProductOutlined, ShoppingCartOutlined, UserAddOutlined } from "@ant-design/icons";



const menuItems = [
  {
    key: "home",
    label: (
      <Link to="/home">
        {" "}
        <HomeOutlined />
        Home
      </Link>
    ),
  },
  {
    key: "products",
    label: (
      <Link to="/products">
        <ProductOutlined />
        Sản phẩm
      </Link>
    ),
  },
  //   { key: "details", label: <Link to="/details">Chi tiết</Link> },
  {
    key: "cart",
    label: (
      <Link to="/cart">
        <ShoppingCartOutlined />
        Giỏ hàng
      </Link>
    ),
  },
  {
    key: "register",
    label: (
      <Link to="/dangky">
        {" "}
        <UserAddOutlined />
        Đăng ký
      </Link>
    ),
  },
  {
    key: "login",
    label: (
      <Link to="/login">
        {" "}
        <LoginOutlined />
        Đăng nhập
      </Link>
    ),
  },
  {
    label: <OpenAIOutlined />,
  },
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
          {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item> */}
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
     
      <Footer className="custom-footer">
        <Row justify="center">
          <Col span={24} className="tagline">
            Thương Hiệu Làm Lên Tên Tuổi
          </Col>
        </Row>
        <Row gutter={[16, 8]} justify="center">
          <Col span={10} className="title">
            TẬP ĐOÀN QUỐC TẾ Á CHÂU
          </Col>
          <Col span={10} className="title">
            Thông Tin Liên Hệ
          </Col>
        </Row>
        <Row gutter={[16, 8]} justify="center">
          <Col span={10}>
            Trụ sở: Lô C7/II, Đường Số 2E, KCN Bình Chánh, Hồ Chí Minh
          </Col>
          <Col span={10}>
            Số Điện Thoại: <a href="tel:1900636066">1900 63 60 66</a>
          </Col>
        </Row>
        <Row gutter={[16, 8]} justify="center">
          <Col span={10}>Lô E2-3, Đường số 10, KCN Hải Sơn, Long An</Col>
          <Col span={10}>
            Email:{" "}
            <a href="mailto:info@royalhelmet.com.vn">info@royalhelmet.com.vn</a>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={12} className="brand-title">
            NHỮNG THƯƠNG HIỆU TRỰC THUỘC
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};


export default LayoutHome;
