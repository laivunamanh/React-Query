import instance from '@/configs/axios';
import { TProduct } from '@/interface/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Skeleton, Table } from 'antd';
import React from 'react'

import { Link } from 'react-router-dom';
type props ={}
const ListProduct = () => {
  const [messageApi, contextHolder]=message.useMessage();
  const queryclient=useQueryClient();
  const {data, isLoading,isError,error}=useQuery({
    queryKey:["products"],
    queryFn:async()=>{
      try {
        return await instance.get(`/products`)
      } catch (error) {
        throw Error ("loi"+error)
      }
    }
  });
  const {mutate}=useMutation({
    mutationFn:async(id:number)=>{
      try {
        return await instance.delete(`/products/${id}`)
      } catch (error) {
        throw Error ("loi")
      }
    },
    onSuccess:()=>{
      queryclient.invalidateQueries({
        queryKey:["products"]
      });
      messageApi.open({
        type:'success',
        content:"xoa thanh cong"
      })
    },
    onError:(error)=>{
      messageApi.open({
        type:"success",
        content: error.message
      })
    }
  })
  if(isError)return <div>{error.message}</div>
  if(isLoading)return <div>...loading</div>
  const dataSource= data?.data.map((products:TProduct)=>({
    key:products.id,
    ...products,
  }))
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "image",
      
      key: "image",
      render: (_:any,products:any) =>{
        return <img src={products.image} alt="" />
      }
    },
    {
      title: "chuc nang",
       key: "chuc nang",
       render:(_:any,products:any)=>{
        return (
          <div>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => mutate(products.id)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
              <Link to={`/products/${products.id}/edit`}>
              <Button>Cập nhật</Button>
            </Link>
            </Popconfirm>
            
          </div>
        );
       }
    }
  ];
  return (
    <div>
      {contextHolder}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Quản lý sản phẩm</h1>
          <Link to={`/admin/products/add`} className="mb-4 block">
            <Button type="primary">Add</Button>
          </Link>
        </div>
        <Table dataSource={dataSource} columns={columns} />;
      </div>
    </div>
  );
};

export default ListProduct