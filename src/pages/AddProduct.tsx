import React from "react";
import { Button, Form, FormProps, Input, Select, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";

type FieldType = {
  name: string;
  price: number;
  image: string;
  description: string;
  categoryId: number;
};

const AddProduct = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // Fetch danh mục từ API
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await instance.get(`/categories`);
        return response.data;
      } catch (error) {
        throw new Error("Error fetching categories");
      }
    },
  });

  // Mutation để thêm sản phẩm
  const { mutate } = useMutation({
    mutationFn: async (product: FieldType) => {
      try {
        return await instance.post(`/products`, product);
      } catch (error) {
        throw new Error("Lỗi khi thêm sản phẩm");
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Thêm sản phẩm thành công!",
      });
      form.resetFields();
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    mutate(values);
  };

  return (
    <div>
      <Button danger>
        <Link to={`/admin/products`}>Quay về</Link>
      </Button>
      <div>
        {contextHolder}
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Hình ảnh"
            name="image"
            rules={[
              { required: true, message: "Vui lòng nhập link hình ảnh!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>

          {/* Thêm danh mục */}
          <Form.Item<FieldType>
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories?.map((category: any) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
