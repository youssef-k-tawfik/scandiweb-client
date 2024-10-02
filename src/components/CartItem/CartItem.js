// import styles from "./CartItem.module.css";
import { Component } from "react";
import Attributes from "../Attributes/Attributes";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { CartContext } from "../../contexts/CartContext";

export default class CartItem extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);

    this.state = {
      item: props.item,
    };
  }

  handleAttributeClick = (attributeSet, value) => {
    // * not allowing the user to change the attributes from the cart overlay
    // * as per the requirements
    return;
    // const { item } = this.state;
    // const { cart, updateCartWithNewItem } = this.context;

    // const currentSelectedAttributes = item.selectedAttributes;
    // const newSelectedAttributes = {
    //   ...currentSelectedAttributes,
    //   [attributeSet]: value,
    // };

    // // *check if same item exists
    // const existingItemIndex = cart.items.findIndex(
    //   (cartItem) =>
    //     cartItem.id === item.id &&
    //     Object.keys(cartItem.selectedAttributes).every(
    //       (key) =>
    //         cartItem.selectedAttributes[key] === newSelectedAttributes[key]
    //     )
    // );

    // if (existingItemIndex !== -1) {
    //   toast.error(
    //     "Another item with the same variant already exists in the cart."
    //   );
    //   console.error(
    //     "Another item with the same variant already exists in the cart."
    //   );

    //   return;
    // }

    // const newItem = {
    //   ...item,
    //   selectedAttributes: newSelectedAttributes,
    // };

    // updateCartWithNewItem(newItem, currentSelectedAttributes);
  };

  render() {
    const { item } = this.state;
    const { handleIncrementQuantity, handleDecrementQuantity } = this.context;

    return (
      <div className="flex gap-4 justify-between">
        {/* Details */}
        <div>
          <h3 className="text-lg">{item.name}</h3>
          <p className="font-semibold" data-testid="cart-item-amount">
            ${item.price}
          </p>
          <div className="mt-2">
            <Attributes
              attributes={item.attributes}
              selectedAttributes={item.selectedAttributes}
              colorAttributeSize={6}
              cartAttribute={true}
              handleAttributeClick={this.handleAttributeClick}
              clickable={false}
            />
          </div>
        </div>
        {/* Quantity */}
        <div className="flex flex-col justify-between ms-auto gap-4 ">
          <button
            data-testid="cart-item-amount-increase"
            className="size-10 border border-black flex justify-center items-center"
            onClick={() =>
              handleIncrementQuantity(item.id, item.selectedAttributes)
            }
          >
            <FaPlus className="text-lg" />
          </button>
          <p className="text-center text-xl font-bold">{item.quantity}</p>
          <button
            data-testid="cart-item-amount-decrease"
            className="size-10 border border-black flex justify-center items-center"
            onClick={() =>
              handleDecrementQuantity(item.id, item.selectedAttributes)
            }
          >
            <FaMinus className="text-lg" />
          </button>
        </div>
        {/* Image */}
        <div className="w-32">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }
}
