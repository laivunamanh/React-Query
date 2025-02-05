import Bill from "@/home/Bill";
import Cart from "@/home/Cart";
import ChatBox from "@/home/ChatBox";
import ChatboxAI from "@/home/ChatBoxAI";

import Home from "@/home/home";
import LayoutHome from "@/home/layout";
import ProductDetails from "@/home/ProductDetails";
import ProductsHome from "@/home/Products";
import AddCategory from "@/pages/AddCategories";
import AddProduct from "@/pages/AddProduct";
import ListCategories from "@/pages/categories";
import Dangky from "@/pages/dangnhap";
import Dangnhap from "@/pages/dngky";
import EditCategories from "@/pages/EditCategories";
import EditProduct from "@/pages/EditProduct";
import LayoutAdmin from "@/pages/layout";
import ListProduct from "@/pages/ListProduct";
import ListUser from "@/pages/ListUser";
import { Route, Routes } from "react-router-dom";

const Router = () => {
    return (
      <Routes>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route path="products" index element={<ListProduct />} />
          <Route path="products/add" index element={<AddProduct />} />
          <Route path="products/:id/edit" index element={<EditProduct />} />
          <Route path="users" index element={<ListUser />} />
          <Route path="danhmuc" index element={<ListCategories />} />
          <Route path="AddDanhmuc" index element={<AddCategory />} />
          <Route path="Editdanhmuc/:id" index element={<EditCategories />} />
        </Route>
        <Route path="/" element={<LayoutHome />}>
          <Route path="home" index element={<Home />} />
          <Route path="products" index element={<ProductsHome />} />
          <Route path="products/:id" index element={<ProductDetails />} />
          <Route path="cart" index element={<Cart />} />
          <Route path="login" index element={<Dangnhap />} />
          <Route path="dangky" index element={<Dangky />} />
          <Route path="bill" index element={<Bill />} />
          <Route path="ChatBoxAIAI" index element={<ChatboxAI />} />
          <Route path="ChatBox" index element={<ChatBox />} />
        </Route>
      </Routes>
    );
};
export default Router;
