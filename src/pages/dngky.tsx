import React from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";
type FieldType = {
  name: string;
  email: string;
  password: string;
};
const Dangnhap = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryclient = useQueryClient();
  const [form] = Form.useForm();
  const { mutate } = useMutation({
    mutationFn: async (users: FieldType) => {
      try {
        return await instance.post(`/login`, users);
      } catch (error) {
        throw new Error(`dn that bai`);
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Đăng nhập thành công",
      });
      form.resetFields();
    },
    onError: (error) => {
      messageApi.open({
        type: "error", // Corrected to "error"
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
        <Link to={`/admin/products`}>quay ve</Link>
      </Button>
      <div>
        {contextHolder}

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* <Form.Item<FieldType>
            label="name"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item<FieldType>
            label="email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Dangnhap;
