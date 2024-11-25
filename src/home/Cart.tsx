import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, message, Card, Space } from "antd";
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
      return response.data;
    },
  });

  // Mutation để xóa sản phẩm khỏi giỏ hàng
  const { mutate: removeItem } = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]); // Cập nhật lại dữ liệu giỏ hàng
      messageApi.success("Đã xóa sản phẩm khỏi giỏ hàng");
    },
    onError: () => {
      messageApi.error("Không thể xóa sản phẩm");
    },
  });

  // Tính tổng giá trị giỏ hàng
  const calculateTotal = () => {
    return data?.reduce((acc: number, item: CartItem) => acc + item.total, 0);
  };

  if (isLoading) return <div>Đang tải giỏ hàng...</div>;

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

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
    },
    {
      title: "Tổng cộng",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `${total.toLocaleString()} VND`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (record: CartItem) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <Card
        title={<h2>Giỏ hàng</h2>}
        extra={
          <Link to="/">
            <Button icon={<ShoppingCartOutlined />}>Tiếp tục mua sắm</Button>
          </Link>
        }
        style={{ marginBottom: 24 }}
      >
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
          <h3>
            Tổng tiền:{" "}
            <span style={{ color: "#27ae60" }}>
              {calculateTotal().toLocaleString()} VND
            </span>
          </h3>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: "#2980b9", borderColor: "#2980b9" }}
            onClick={() => messageApi.success("Mua hàng thành công!")}
          >
            Thanh toán
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Cart;
