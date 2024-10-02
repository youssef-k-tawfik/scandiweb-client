// import styles from "./QuickShopButton.module.css";
import { TbShoppingCartPlus } from "react-icons/tb";
import { Component } from "react";
import { CartContext } from "../../contexts/CartContext";

export default class QuickShopButton extends Component {
  static contextType = CartContext;

  render() {
    const { addItem } = this.context;

    const { product } = this.props;

    return (
      <div className="absolute top-full -end-full group-hover:end-2 -translate-y-1/2 transition-all duration-300 hover:scale-110">
        <button
          className="size-10 rounded-full bg-green-400 flex justify-center items-center"
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
        >
          <TbShoppingCartPlus className="text-white" />
        </button>
      </div>
    );
  }
}
