import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Typography,
  message,
  Empty,
} from "antd";
import instance from "@/configs/axios";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const provincesFreeShip = ["Hà Nội", "Hồ Chí Minh"]; // Các tỉnh miễn phí ship

const Bill: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Lấy danh sách sản phẩm từ giỏ hàng
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await instance.get("/cart");
      return response.data || [];
    },
  });

  // Tính tổng tiền sản phẩm
  const calculateTotal = () => {
    if (!Array.isArray(cartData)) return 0;
    return cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Tính phí ship
  const shippingFee =
    selectedProvince && !provincesFreeShip.includes(selectedProvince)
      ? 50000
      : 0;

  // Xử lý đặt hàng
  const { mutate: placeOrder, isLoading: isPlacingOrder } = useMutation({
    mutationFn: async (values: {
      name: string;
      phone: string;
      email: string;
      address: string;
      province: string;
    }) => {
      const orderData = {
        ...values,
        items: cartData,
        total: calculateTotal() + shippingFee,
        shippingFee,
      };
      await instance.post("/orders", orderData);
      await instance.delete("/cart"); // Xóa giỏ hàng sau khi đặt hàng
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      messageApi.success("Đặt hàng thành công!");
      form.resetFields();
      setTimeout(() => navigate("/home"), 2000);
    },
    onError: () => {
      messageApi.error("Có lỗi xảy ra khi đặt hàng.");
    },
  });

  if (isLoading) return <div>Đang tải giỏ hàng...</div>;

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card title="Thông tin đơn hàng" style={{ marginBottom: 24 }}>
        {cartData?.length > 0 ? (
          <>
            <Table
              dataSource={cartData}
              columns={[
                { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
                {
                  title: "Đơn giá",
                  dataIndex: "price",
                  key: "price",
                  render: (price) => `${price.toLocaleString()} VND`,
                },
                { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
                {
                  title: "Thành tiền",
                  key: "total",
                  render: (_, record) =>
                    `${(record.price * record.quantity).toLocaleString()} VND`,
                },
              ]}
              rowKey="id"
              pagination={false}
            />
            <Typography.Title
              level={3}
              style={{ textAlign: "right", marginTop: 20 }}
            >
              Tổng tiền:{" "}
              <span style={{ color: "#27ae60" }}>
                {(calculateTotal() + shippingFee).toLocaleString()} VND
              </span>
            </Typography.Title>
          </>
        ) : (
          <Empty description="Giỏ hàng trống" />
        )}
      </Card>

      <Card title="Thông tin khách hàng">
        <Form form={form} layout="vertical" onFinish={placeOrder}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Vui lòng nhập email hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="province"
            label="Tỉnh/Thành phố"
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
            ]}
          >
            <Select
              placeholder="Chọn tỉnh/thành phố"
              onChange={(value) => setSelectedProvince(value)}
            >
              <Select.Option value="Hà Nội">Hà Nội</Select.Option>
              <Select.Option value="Hồ Chí Minh">Hồ Chí Minh</Select.Option>
              <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
              <Select.Option value="Hải Phòng">Hải Phòng</Select.Option>
              <Select.Option value="Cần Thơ">Cần Thơ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ giao hàng"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Space
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link to="/cart">
              <Button icon={<ShoppingCartOutlined />}>Quay lại giỏ hàng</Button>
            </Link>
            <Button type="primary" htmlType="submit" loading={isPlacingOrder}>
              Xác nhận đơn hàng
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default Bill;
    