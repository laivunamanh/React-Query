import React from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";

type FieldType = {
  email: string;
  password: string;
};

const Dangnhap = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: async (users: FieldType) => {
      try {
        const response = await instance.post(`/login`, users);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Đăng nhập thành công",
      });
      form.resetFields();
      // Optionally refresh query data
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error: any) => {
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
        <Link to={`/home`}>Back to Products</Link>
      </Button>
      <div>
        {contextHolder}
        <Form
          name="loginForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, margin: "0 auto" }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
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
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Dangnhap;
