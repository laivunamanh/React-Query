import React from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";

type FieldType = {
  name: string;
};

const AddCategory = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // Mutation để thêm category
  const { mutate } = useMutation({
    mutationFn: async (category: FieldType) => {
      try {
        return await instance.post(`/categories`, category);
      } catch (error) {
        throw new Error("Lỗi khi thêm danh mục");
      }
    },
    onSuccess: () => {
      messageApi.success("Thêm danh mục thành công");
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error(error.message);
    },
  });

  // Xử lý form submit
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    mutate(values);
  };

  return (
    <div>
      <Button danger>
        <Link to={`/admin/danhmuc`}>Quay về</Link>
      </Button>
      <div>
        {contextHolder}
        <Form
          form={form}
          name="add-category"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Thêm danh mục
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddCategory;
