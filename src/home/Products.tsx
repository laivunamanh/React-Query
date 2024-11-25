import React from "react";
import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import { Row, Col, Card, message } from "antd";

type TProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const ProductsHome: React.FC = () => {
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
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductsHome;
