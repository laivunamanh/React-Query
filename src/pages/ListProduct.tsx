import React, { useState } from "react";
import { Button, message, Popconfirm, Table, Select } from "antd";
import { Link } from "react-router-dom";
import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TProduct } from "@/interface/product";

const ListProduct = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch danh sách sản phẩm
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get("/products");
      return response.data;
    },
  });

  // Fetch danh mục sản phẩm
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await instance.get("/categories");
      return response.data;
    },
  });

  // Xử lý xóa sản phẩm
  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      messageApi.open({
        type: "success",
        content: "Product deleted successfully",
      });
    },
    onError: (error: any) => {
      messageApi.open({ type: "error", content: error.message });
    },
  });

  if (isError) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  // Lọc sản phẩm theo danh mục đã chọn
  const filteredProducts = selectedCategory
    ? productsData.filter(
        (product: TProduct) => product.categoryId === selectedCategory
      )
    : productsData;

  const dataSource = filteredProducts.map((product: TProduct) => ({
    key: product.id,
    ...product,
  }));

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Image",
      key: "image",
      render: (_: any, product: TProduct) => (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, product: TProduct) => (
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
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Product Management</h1>
        <Link to="/admin/products/add">
          <Button type="primary">Add Product</Button>
        </Link>
      </div>
      <Select
        placeholder="Select category"
        style={{ width: 200, marginBottom: 16 }}
        onChange={(value) => setSelectedCategory(value)}
        allowClear
      >
        {isLoadingCategories ? (
          <Select.Option disabled>Loading categories...</Select.Option>
        ) : (
          categoriesData?.map((category: any) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))
        )}
      </Select>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default ListProduct;
