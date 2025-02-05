import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, message, Popconfirm, Table } from 'antd';
import instance from '@/configs/axios';
import { TUser } from '@/interface/Ussers';
import { Link } from 'react-router-dom';

const ListUser = () => {
    const queryclient =useQueryClient()
    const [messageApi,contexrHolder ]=message.useMessage();
    const {data, isloading, isError, error}=useQuery({
        queryKey:["users"],
        queryFn:async()=>{
            try{
                return await instance.get("/users");
            }catch(error){
                throw new Error("Error fetching User")
            }
        },
    });
    const {mutate}= useMutation({
        mutationFn:async(id:number)=>{
            try{
                return await instance.delete(`/users/${id}`)
            }catch (error){
                throw new Error("Error deleting User");
            }
        },
        onSuccess:()=>{
            queryclient.invalidateQueries({
                queryKey:["users"],
            });
            messageApi.open({
              type: "success",
              content: "Product deleted successfully",
            });
        },
        onError:(error:any)=>{
            messageApi.open({
                type:"error",
                content:error.messgae,
            })
        }
    })

    if (isError) return <div>error;{error.message}</div>
    if (isloading) return <div>loading....</div>
    const dataSource = data?.data.map((user:TUser)=>({
        key:user.id,
        ...user,
        }));
        const cloumns = [
            {
                title:"name",
                dataIndex:"name",
                key:"name"
            },
            {
                title:"email",
                dataIndex:"email",
                key:"email"
            },
            {
                title:"password",
                dataIndex:"password",
                key:"password"
            },
            {
      title: "Actions",
      key: "actions",
      render: (_: any, user: TUser) => {
        return (
          <div>
            <Popconfirm
              title="Are you sure to delete this product?"
              onConfirm={() => mutate(user.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger style={{ marginRight: "8px" }}>
                Delete
              </Button>
            </Popconfirm>


          </div>
        );
      },
    },
        ]
  return (
    <div>
      {contexrHolder}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Product Management</h1>
          <Link to="/admin/products/add" className="mb-4 block">
            <Button type="primary">Add Product</Button>
          </Link>
          
        </div>
        <Table dataSource={dataSource} columns={cloumns} />
      </div>
    </div>
  );
}

export default ListUser;
