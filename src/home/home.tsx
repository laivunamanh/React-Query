import React from "react";
import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import { Row, Col, Card, message, Button, Space } from "antd";
import { Link } from "react-router-dom";

type TProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
};

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

  return (
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
                  title={product.name}
                  description={`${product.price.toLocaleString()} VND`}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
 