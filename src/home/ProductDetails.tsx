import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Row, Col, message, Rate, Space, Divider } from "antd";
import instance from "@/configs/axios";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";

type TProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number; // Đánh giá sản phẩm
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  // Lấy dữ liệu sản phẩm theo ID
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const response = await instance.get(`/products/${id}`);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Lỗi khi tải thông tin sản phẩm"
        );
      }
    },
    enabled: !!id, // Chỉ fetch khi có ID
  });

  // Mutation để thêm sản phẩm vào giỏ hàng
  const { mutate: addToCart } = useMutation({
    mutationFn: async (product: TProduct) => {
      try {
        return await instance.post("/cart", {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price,
        });
      } catch (error) {
        throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // Làm mới dữ liệu giỏ hàng
      messageApi.success(`${data.name} đã được thêm vào giỏ hàng`);
    },
    onError: (error: Error) => {
      messageApi.error(error.message);
    },
  });

  if (isLoading) return <div>Đang tải...</div>;

  if (isError) {
    messageApi.error((error as Error).message);
    return <div>{(error as Error).message}</div>;
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#f9f9f9" }}>
      {contextHolder}
      <Link to="/">
        <Button type="default" style={{ marginBottom: 16 }}>
          Quay lại danh sách sản phẩm
        </Button>
      </Link>

      <Row gutter={24} align="top">
        {/* Phần hình ảnh sản phẩm */}
        <Col xs={24} sm={12} md={10}>
          <Card
            cover={
              <img
                alt={data.name}
                src={data.image}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            }
            style={{ borderRadius: "8px" }}
          />
        </Col>

        {/* Phần thông tin sản phẩm */}
        <Col xs={24} sm={12} md={14}>
          <Card
            title={<h2>{data.name}</h2>}
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#2c3e50",
              }}
            >
              {data.price.toLocaleString()} VND
            </p>

            <Rate
              value={data.rating}
              disabled
              style={{ fontSize: "1.2rem", color: "#f39c12" }}
            />
            <Divider />

            <h3>Mô tả</h3>
            <p>{data.description}</p>

            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={() => addToCart(data)}
                block
                style={{
                  backgroundColor: "#27ae60",
                  borderColor: "#27ae60",
                  fontWeight: "bold",
                }}
              >
                Thêm vào giỏ hàng
              </Button>

              <Button
                type="primary"
                icon={<HeartOutlined />}
                size="large"
                onClick={() =>
                  messageApi.success(`${data.name} đã được thêm vào yêu thích`)
                }
                block
                style={{
                  backgroundColor: "#e74c3c",
                  borderColor: "#e74c3c",
                  fontWeight: "bold",
                }}
              >
                Thêm vào yêu thích
              </Button>
            </Space>

            <Button
              type="primary"
              style={{
                backgroundColor: "#2980b9",
                borderColor: "#2980b9",
                width: "100%",
                marginTop: 20,
                fontWeight: "bold",
              }}
              size="large"
              onClick={() =>
                messageApi.success(`Mua ngay sản phẩm ${data.name}`)
              }
            >
              Mua ngay
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetails;
