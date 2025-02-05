import React from "react";
import { Button, Form, Input, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link, useParams } from "react-router-dom";

type FieldType = {
  name: string;
  description: string;
};

const EditCategories = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { id } = useParams();

  // Fetch category data by ID
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      try {
        return await instance.get(`/categories/${id}`);
      } catch (error) {
        throw new Error("Error fetching category data");
      }
    },
  });

  // Mutation for updating the category
  const { mutate } = useMutation({
    mutationFn: async (category: FieldType) => {
      try {
        return await instance.put(`/categories/${id}`, category);
      } catch (error) {
        throw new Error("Error updating category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      messageApi.open({
        type: "success",
        content: "Category updated successfully",
      });
    },
    onError: (error: Error) => {
      messageApi.open({ type: "error", content: error.message });
    },
  });

  // Handle form submission
  const onFinish = (values: FieldType) => {
    mutate(values);
  };

  if (isError) return <div>Error: {error?.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Button danger>
        <Link to="/admin/categories">Back to Categories</Link>
      </Button>
      <div>
        {contextHolder}
        <Form
          form={form}
          name="edit-category"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ ...data?.data }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the category name!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the category description!",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item> */}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update Category
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditCategories;
