import "./App.css";
import { Component } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Tech from "./components/Tech/Tech";
import Clothes from "./components/Clothes/Clothes";
import NotFound from "./components/NotFound/NotFound";
import ProductDetailsPage from "./components/ProductDetailsPage/ProductDetailsPage";
import CartProvider from "./contexts/CartContext";
import { Toaster } from "react-hot-toast";

export default class App extends Component {
  constructor(props) {
    super(props);

    // this.state = {};
    this.routes = createBrowserRouter([
      {
        path: "",
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/all" replace /> },
          { path: "/all", element: <Home /> },
          { path: "/tech", element: <Tech /> },
          { path: "/clothes", element: <Clothes /> },
          { path: "/product/:id", element: <ProductDetailsPage /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ]);
  }

  render() {
    return (
      <CartProvider>
        <RouterProvider router={this.routes} />
        <Toaster position="top-center" containerStyle={{ marginTop: "40px" }} />
      </CartProvider>
    );
  }
}
