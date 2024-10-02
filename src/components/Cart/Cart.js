// import styles from "./Cart.module.css";
import { Component } from "react";
import { CartContext } from "../../contexts/CartContext";
import CartItem from "../CartItem/CartItem";

export default class Cart extends Component {
  static contextType = CartContext;

  render() {
    const {
      cart: { items },
      userCurrency,
    } = this.context;
    console.log("items from cart:", items);

    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

    return (
      <div className=" flex flex-col gap-4 ">
        <p>
          <span className="font-extrabold">My Bag: </span>
          {totalQuantity} items
        </p>
        <div className="flex flex-col gap-10 max-h-[400px] overflow-y-auto scrollbar pe-2 ">
          {items.length > 0 ? (
            items.map((item) => (
              <CartItem
                key={`${item.id}${JSON.stringify(item.selectedAttributes)}`}
                item={item}
              />
            ))
          ) : (
            <p className="text-center min-w-40">Your cart is empty</p>
          )}
        </div>
        <div className="font-bold flex justify-between">
          <span className="font-roboto font-semibold">Total</span>
          <span className="font-bold" data-testid="cart-total">
            {`${userCurrency}${totalPrice.toFixed(2)}`}
          </span>
        </div>
        <button
          disabled={items.length === 0}
          className="w-full py-2 bg-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
          onClick={() => console.log("PLACE ORDER")}
        >
          PLACE ORDER
        </button>
      </div>
    );
  }
}
