// import styles from "./ProductListing.module.css";
import { Component } from "react";
import ProductItem from "../ProductItem/ProductItem";

export default class ProductListing extends Component {
  render() {
    const { products } = this.props;

    if (!products) {
      return (
        <div className="text-red-500 font-bold text-xl">
          No products retrieved!
        </div>
      );
    }

    return (
      <div>
        <div className="grid lg:grid-cols-3 gap-8 md:grid-cols-2 ">
          {products?.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }
}
