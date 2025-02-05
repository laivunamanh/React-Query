import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  message,
  Card,
  Space,
  Popconfirm,
  Typography,
  Empty,
  InputNumber,
} from "antd";
import instance from "@/configs/axios";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

const Cart: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  // Fetch dữ liệu giỏ hàng
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await instance.get("/cart");
      return response.data || [];
    },
  });

  // Mutation để xóa sản phẩm khỏi giỏ hàng
  const { mutate: removeItem } = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      messageApi.success("Đã xóa sản phẩm khỏi giỏ hàng");
    },
    onError: () => {
      messageApi.error("Không thể xóa sản phẩm");
    },
  });

  // Mutation để cập nhật số lượng sản phẩm
  const { mutate: updateQuantity } = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      await instance.patch(`/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      messageApi.success("Cập nhật số lượng thành công");
    },
    onError: () => {
      messageApi.error("Không thể cập nhật số lượng");
    },
  });

  // Tính tổng giá trị giỏ hàng
  const calculateTotal = () => {
    if (!Array.isArray(data)) return 0;
    return data.reduce(
      (acc: number, item: CartItem) => acc + item.price * item.quantity,
      0
    );
  };

  if (isLoading) return <div>Đang tải giỏ hàng...</div>;
  if (isError) return <div>{(error as Error).message}</div>;

  // Cấu hình cột bảng
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, record: CartItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => {
            if (value) updateQuantity({ id: record.id, quantity: value });
          }}
        />
      ),
    },
    {
      title: "Tổng cộng",
      dataIndex: "total",
      key: "total",
      render: (_: any, record: CartItem) =>
        `${(record.price * record.quantity).toLocaleString()} VND`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (record: CartItem) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa sản phẩm này?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => removeItem(record.id)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card
        title={<Typography.Title level={2}>Giỏ hàng</Typography.Title>}
        extra={
          <Link to="/home">
            <Button icon={<ShoppingCartOutlined />}>Tiếp tục mua sắm</Button>
          </Link>
        }
        style={{ marginBottom: 24 }}
      >
        {data?.length > 0 ? (
          <>
            <Table
              dataSource={data}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
            <Space
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Typography.Title level={3}>
                Tổng tiền:{" "}
                <span style={{ color: "#27ae60" }}>
                  {calculateTotal().toLocaleString()} VND
                </span>
              </Typography.Title>
              <Link to={'/bill'}>
                <Button
                  type="primary"
                  size="large"
                  style={{ backgroundColor: "#2980b9", borderColor: "#2980b9" }}
                  onClick={() => messageApi.success("Mua hàng thành công!")}
                >
                  Thanh toán
                </Button>
              </Link>
            </Space>
          </>
        ) : (
          <Empty description="Giỏ hàng trống" />
        )}
      </Card>
    </div>
  );
};

export default Cart;
