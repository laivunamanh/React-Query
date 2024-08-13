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
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={()=>mutate(products.id)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        );
       }
    }
  ];
  return (
    <div>
      {contextHolder}
      <div>
        <Table dataSource={dataSource} columns={columns} />;
      </div>
    </div>
  );
};

export default ListProduct