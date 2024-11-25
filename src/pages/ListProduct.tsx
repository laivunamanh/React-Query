import instance from "@/configs/axios";
import { TProduct } from "@/interface/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const ListProduct = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        return await instance.get("/products");
      } catch (error) {
        throw new Error("Error fetching products");
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      try {
        return await instance.delete(`/products/${id}`);
      } catch (error) {
        throw new Error("Error deleting product");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      messageApi.open({
        type: "success",
        content: "Product deleted successfully",
      });
    },
    onError: (error: any) => {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    },
  });

  if (isError) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  const dataSource = data?.data.map((product: TProduct) => ({
    key: product.id,
    ...product,
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Image",
      key: "image",
      render: (_: any, product: TProduct) => {
        return (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, product: TProduct) => {
        return (
          <div>
            <Popconfirm
              title="Are you sure to delete this product?"
              onConfirm={() => mutate(product.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger style={{ marginRight: "8px" }}>
                Delete
              </Button>
            </Popconfirm>

            <Link to={`/admin/products/${product.id}/edit`}>
              <Button type="primary">Edit</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {contextHolder}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Product Management</h1>
          <Link to="/admin/products/add" className="mb-4 block">
            <Button type="primary">Add Product</Button>
          </Link>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default ListProduct;
