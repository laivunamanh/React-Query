import React from "react";
import { Button, Form, Input, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link, useParams } from "react-router-dom";

type FieldType = {
  name: string;
  price: number;
  image: string;
  description: string;
};

const EditProduct = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { id } = useParams();

  // Fetching product data by ID
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      try {
        return await instance.get(`/products/${id}`);
      } catch (error) {
        throw new Error("Error fetching product data");
      }
    },
  });

  // Mutation for updating the product
  const { mutate } = useMutation({
    mutationFn: async (product: FieldType) => {
      try {
        return await instance.put(`/products/${id}`, product);
      } catch (error) {
        throw new Error("Error updating product");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      messageApi.open({
        type: "success",
        content: "Product updated successfully",
      });
    },
    onError: (error: Error) => {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    },
  });

  // Handling form submission
  const onFinish = (values: FieldType) => {
    console.log("Form values:", values);
    mutate(values);
  };

  // Handling error and loading states
  if (isError) return <div>Error: {error?.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Button danger>
        <Link to="/admin/products">Back to Products</Link>
      </Button>
      <div>
        {contextHolder}
        <Form
          form={form}
          name="edit-product"
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
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please input the product price!" },
              { type: "number", message: "Price must be a number" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[
              { required: true, message: "Please input the product image!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the product description!",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update Product
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProduct;
