// QuickShopButton.js
// This component is responsible for rendering the quick shop button.
// The quick shop button is used to add a product to the cart.

// import styles from "./QuickShopButton.module.css";
import { TbShoppingCartPlus } from "react-icons/tb";
import { Component } from "react";
import { CartContext } from "../../contexts/CartContext";

export default class QuickShopButton extends Component {
  static contextType = CartContext;

  render() {
    const { addItem, toggleShowCart } = this.context;

    const { product } = this.props;

    return (
      <div className="absolute top-full -end-full group-hover:end-2 -translate-y-1/2 transition-all duration-300 hover:scale-110">
        <button
          className="size-10 rounded-full bg-green-400 flex justify-center items-center"
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
            toggleShowCart();
          }}
        >
          <TbShoppingCartPlus className="text-white" />
        </button>
      </div>
    );
  }
}
