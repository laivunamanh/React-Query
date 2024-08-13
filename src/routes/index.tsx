import AddProduct from "@/pages/AddProduct";
import Dangky from "@/pages/dangnhap";
import Dangnhap from "@/pages/dngky";
import EditProduct from "@/pages/EditProduct";
import LayoutAdmin from "@/pages/layout";
import ListProduct from "@/pages/ListProduct";
import { Route, Routes } from "react-router-dom";

const Router = () => {
    return (
      <Routes>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route path="products" index element={<ListProduct />} />
          <Route path="products/add" index element={<AddProduct />} />
          <Route path="products/:id/edit" index element={<EditProduct />} />
          <Route path="dangky" index element={<Dangky />} />
          <Route path="login" index element={<Dangnhap />} />
        </Route>
      </Routes>
    );
};
export default Router;
