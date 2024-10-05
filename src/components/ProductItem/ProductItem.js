// ProductItem.js
// This component is responsible for rendering the product card.
// It displays the product image, name, and price.
// The quick shop button is displayed only when the user hovers over the product card while the product is in stock.

// import styles from "./ProductItem.module.css";
import { Component } from "react";
import QuickShopButton from "../QuickShopButton/QuickShopButton";
import { Link } from "react-router-dom";

export default class ProductItem extends Component {
  render() {
    const { product } = this.props;

    return (
      <Link to={`/product/${product.id}`} className="no-underline">
        <div
          className="group  p-4 hover:scale-105 hover:drop-shadow-2xl bg-white duration-300"
          data-testid={`product-${product.name
            .split(" ")
            .join("-")
            .toLowerCase()}`}
        >
          <div className="inner text-lg overflow-hidden">
            {/* image  */}
            <div className="relative mb-4 h-[330px]">
              <img
                src={product.gallery[0]}
                alt="product"
                className="w-full h-full object-cover md:object-top"
              />
              {/* out of stock layer */}
              {!product.inStock && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <p className="text-white text-3xl font-semibold">
                    Out of Stock
                  </p>
                </div>
              )}
              {/* Quick Shop Button */}
              {product.inStock && <QuickShopButton product={product} />}
            </div>
            {/* Product title */}
            <h3 className="font-light">{product.name}</h3>
            {/* Product Price */}
            <p className="font-semibold">{`${product.prices[0].currency.symbol}${product.prices[0].amount}`}</p>
          </div>
        </div>
      </Link>
    );
  }
}
