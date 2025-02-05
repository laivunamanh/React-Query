import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Row, Col, message, Rate, Space, Divider, Form, Input, List, Typography } from "antd";
import instance from "@/configs/axios";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";

type TProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
};

type Comment = {
  name: string;
  comment: string;
};

const { TextArea } = Input;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  // Lưu danh sách bình luận
  const [comments, setComments] = useState<Comment[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const response = await instance.get(`/products/${id}`);
        return response.data;
      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Lỗi khi tải thông tin sản phẩm");
      }
    },
    enabled: !!id,
  });

  const { mutate: addToCart } = useMutation({
    mutationFn: async (product: TProduct) => {
      try {
        const response = await instance.post("/cart", {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price,
        });
        return response.data;
      } catch (error: any) {
        console.error(
          "Lỗi khi thêm sản phẩm vào giỏ hàng:",
          error.response?.data || error.message
        );
        throw new Error("Lỗi khi thêm sản phẩm vào giỏ hàng");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      messageApi.success(`Sản phẩm đã được thêm vào giỏ hàng`);
    },
    onError: (error: Error) => {
      messageApi.error(error.message);
    },
  });

  const handleCommentSubmit = (values: Comment) => {
    setComments([...comments, values]);
    messageApi.success("Bình luận đã được thêm!");
  };

  if (isLoading) return <div>Đang tải...</div>;
  if (isError) {
    messageApi.error((error as Error).message);
    return <div>{(error as Error).message}</div>;
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#f9f9f9" }}>
      {contextHolder}
      <Link to="/">
        <Button type="default" style={{ marginBottom: 16 }}>Quay lại danh sách sản phẩm</Button>
      </Link>

      <Row gutter={24} align="top">
        <Col xs={24} sm={12} md={10}>
          <Card
            style={{
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "80%",
            }}
          >
            <img
              alt={data.name}
              src={data.image}
              style={{
                width: "80%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </Card>
        </Col>

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
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2c3e50" }}>
              {data.price.toLocaleString()} VND
            </p>

            <Rate value={data.rating} disabled style={{ fontSize: "1.2rem", color: "#f39c12" }} />
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
                onClick={() => messageApi.success(`${data.name} đã được thêm vào yêu thích`)}
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
              onClick={() => messageApi.success(`Mua ngay sản phẩm ${data.name}`)}
            >
              Mua ngay
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Bình luận */}
      <Card title="Bình luận" style={{ marginTop: 24, borderRadius: "8px", maxWidth: 800, margin: "auto" }}>
        <Form onFinish={handleCommentSubmit} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
          >
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>

          <Form.Item
            label="Bình luận"
            name="comment"
            rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
          >
            <TextArea rows={3} placeholder="Nhập bình luận của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Gửi bình luận</Button>
          </Form.Item>
        </Form>

        {/* Danh sách bình luận */}
        <List
          dataSource={comments}
          renderItem={(item) => (
            <List.Item>
              <Card style={{ width: "100%" }}>
                <Typography.Text strong>{item.name}</Typography.Text>
                <p>{item.comment}</p>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ProductDetails;
