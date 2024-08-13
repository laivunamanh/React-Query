import React from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link, useParams } from "react-router-dom";
import { TProduct } from "@/interface/product";
type FieldType = {
  name: string;
  price: number;
  image: string;
  description: string;
};
const EditProduct = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryclient = useQueryClient();
  const [form] = Form.useForm();
  const {id}= useParams();
  console.log(id)
   const { data, isLoading ,isError,error} = useQuery({
     queryKey: ["products", id],
     queryFn: async () => {
       try {
         return await instance.get(`/products/${id}`);
       } catch (error) {
         throw new Error("loi API");
       }
     },
   });
  const { mutate} = useMutation({
    mutationFn: async (product: FieldType) => {
      try {
        return await instance.put(`/products/${id}`, product);
      } catch (error) {
        throw new Error("loi");
      }
    },
    onSuccess: () => {
        queryclient.invalidateQueries({
          queryKey: ["products"],
        });
      messageApi.open({
        type: "success",
        content: "them thanh cong",
      });
      
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
 if(isError)return <div>{error.message}</div>
 if(isLoading)return <div>...loading</div>

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
          initialValues={{ ...data?.data }}
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
            label="price"
            name="price"
            rules={[
              { required: true, message: "Please input your price!" },
              { message: "phai la so duong" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="image"
            name="image"
            rules={[{ required: true, message: "Please input your image!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <Input />
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

export default EditProduct;
