import React from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";
type FieldType = {
  name: string;
  email:string;
  password:string;
};
const Dangky = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryclient = useQueryClient();
  const [form] = Form.useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: async (user: FieldType) => {
      try {
        return await instance.post(`/signup`, user);
      } catch (error) {
        throw new Error("loi"+error);
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "dk thanh cong",
      });
      form.resetFields();
    },
    onError: (error) => {
      messageApi.open({
        type: "success",
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
          <Form.Item<FieldType>
            label="name"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
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
            rules={[{ required: true, message: "Please input your password!" },{
                type:"string", min:6, message:"phai hon 6 kytu"
            }]}
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

export default Dangky;
