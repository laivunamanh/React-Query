import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button, message, Popconfirm, Table } from "antd";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";

type TCategory = {
  id: number;
  name: string;
};

const ListCategories = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch danh sách categories
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await instance.get("/categories");
        return response.data;
      } catch (error) {
        throw new Error("Error fetching categories");
      }
    },
  });

  // Mutation để xóa category
  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      try {
        return await instance.delete(`/categories/${id}`);
      } catch (error) {
        throw new Error("Error deleting category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      messageApi.success("Category deleted successfully");
    },
    onError: (error: any) => {
      messageApi.error(error.message);
    },
  });

  if (isError) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  const dataSource = data?.map((category: TCategory) => ({
    key: category.id,
    ...category,
  }));

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, category: TCategory) => {
        return (
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => mutate(category.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
            <Link to={`/admin/Editdanhmuc/${category.id}`}>
              <Button type="primary">Edit</Button>
            </Link>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      {contextHolder}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Category Management</h1>
        <Link to="/admin/AddDanhmuc">
          <Button type="primary">Add Category</Button>
        </Link>
      </div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default ListCategories;
