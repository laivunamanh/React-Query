import React from 'react'
import { Button, Form, FormProps, Input, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import instance from '@/configs/axios';
import { Link } from 'react-router-dom';
type FieldType = {
  name: string;
  price: number;
  image: string;
  description:string;
};
const AddProduct = () => {
   const [messageApi, contextHolder] = message.useMessage();
  //  const queryclient = useQueryClient();
   const [form]= Form.useForm()
   const { mutate } = useMutation({
     mutationFn: async (product: FieldType) => {
       try {
         return await instance.post(`/products`, product);
       } catch (error) {
         throw new Error("loi");
       }
     },
     onSuccess: () => {
       messageApi.open({
         type: "success",
         content: "them thanh cong",
       });
        form.resetFields();
     },
     onError: (error) => {
       messageApi.open({
         type: "success",
         content: error.message
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
            label="price"
            name="price"
            rules={[
              { required: true, message: "Please input your price!" }
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
}

export default AddProduct