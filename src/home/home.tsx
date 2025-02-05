import React from "react";
import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import { Row, Col, Card, message, Button, Space, Flex, Typography, Form, Switch, Splitter } from "antd";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";

type TProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
};
const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: '100%' }}>
    <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
      {props.text}
    </Typography.Title>
  </Flex>
);

const Home: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await instance.get(`/products`);
        return response.data; // Assuming response has a `data` field containing products.
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Error fetching products"
        );
      }
    },
  });

  const handleAddToCart = (product: TProduct) => {
    // Mock cart addition logic
    console.log(`Added to cart: ${product.name}`);
    messageApi.success(`${product.name} has been added to your cart.`);
  };

  const handleBuyNow = (product: TProduct) => {
    // Mock buy now logic
    console.log(`Buy now clicked for: ${product.name}`);
    messageApi.success(`Proceeding to purchase ${product.name}.`);
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    messageApi.error((error as Error).message);
    return <div>{(error as Error).message}</div>;
  }

  const cardStyle: React.CSSProperties = {
    width: 620,
  };

  const imgStyle: React.CSSProperties = {
    display: "block",
    width: 273,
  };

 
  const [sizes, setSizes] = React.useState<(number | string)[]>(["50%", "50%"]);
  const [enabled, setEnabled] = React.useState(true);
  return (
    <>
      <Flex vertical gap="middle">
        <Splitter
          onResize={setSizes}
          style={{ height: 355, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
        >
          <Splitter.Panel size={sizes[0]} resizable={enabled}>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="https://cdn.divineshop.vn/image/catalog/Anh-SP/Netflix/NETFLIX-1tuan%20(1)-76597.png?hash=1715588591"
                    alt="Netflix"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              }
            ></Card>
          </Splitter.Panel>
          <Splitter.Panel size={sizes[1]}>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="https://cdn.divineshop.vn/image/catalog/Anh-SP/Netflix/NETFLIX-1tuan%20(1)-76597.png?hash=1715588591"
                    alt="Netflix"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              }
            ></Card>
          </Splitter.Panel>
        </Splitter>
        <Flex gap="middle" justify="space-between">
          <Switch
            value={enabled}
            onChange={() => setEnabled(!enabled)}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
          />
          <Button onClick={() => setSizes(["50%", "50%"])}>Reset</Button>
        </Flex>
      </Flex>

      <div style={{ padding: "24px" }}>
        {contextHolder}
        <h2>Products</h2>
        <Row gutter={[16, 16]}>
          {data?.map((product: TProduct) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Link to={`/products/${product.id}`}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    style={{ padding: 32 }}
                    title={product.name}
                    description={`${product.price.toLocaleString()} VND`}
                  />
                  <Link to={`/products/${product.id}`}>
                    <Button type="primary">Xem Chi Tiết</Button>
                  </Link>
                  <ShoppingCartOutlined />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 1800, marginTop: 25 }}
        >
          <Typography.Title level={3}>Sản Phẩm Mới Nhất</Typography.Title>
          <Row style={{ maxWidth: 1800 }}>
            {data
              ?.slice(-4)
              .reverse()
              .map((product: TProduct) => (
                <Card
                  hoverable
                  style={{ ...cardStyle, marginBottom: 16, marginRight: 16 }}
                  key={product.id} // Tránh lỗi React key
                >
                  <Flex justify="space-between">
                    <img
                      alt={product.name}
                      src={product.image}
                      style={imgStyle}
                    />
                    <Flex
                      vertical
                      align="flex-end"
                      justify="space-between"
                      style={{ padding: 32 }}
                    >
                      <Typography.Title level={3}>
                        {product.name}
                      </Typography.Title>
                      <Typography.Title level={3}>
                        {`${product.price.toLocaleString()} VND`}
                      </Typography.Title>
                      <Link to={`/products/${product.id}`}>
                        <Button type="primary">Xem Chi Tiết</Button>
                      </Link>
                    </Flex>
                  </Flex>
                </Card>
              ))}
          </Row>
        </Form>
      </div>
    </>
  );
};

export default Home;
 