// import axios from "axios";
import { Component, createContext } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export default class CartProvider extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    // this.changeUserCurrency = this.changeUserCurrency.bind(this);
    this.handleIncrementQuantity = this.handleIncrementQuantity.bind(this);
    this.handleDecrementQuantity = this.handleDecrementQuantity.bind(this);
    this.updateCartWithNewItem = this.updateCartWithNewItem.bind(this);
    // this.updateCartWithNewItem = this.updateCartWithNewItem.bind(this);
    this.state = {
      // labels: {
      //   $: "USD",
      //   "€": "EUR",
      //   "£": "GBP",
      //   "AED ": "AED",
      //   "EGP ": "EGP",
      // },
      // userCurrency: localStorage.getItem("userCurrency") || "$",
      userCurrency: "$",
      // exchangeRates: {},
      cart: {
        // totalPrice: 0,
        items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
      },
      showCart: false,
      toggleShowCart: () => {
        this.setState((prevState) => ({
          showCart: !prevState.showCart,
        }));
      },
      // changeUserCurrency: this.changeUserCurrency,
      addItem: this.addItem,
      // removeItem: this.removeItem,
      handleIncrementQuantity: this.handleIncrementQuantity,
      handleDecrementQuantity: this.handleDecrementQuantity,
      updateCartWithNewItem: this.updateCartWithNewItem,
      // updateCartWithNewItem: this.updateCartWithNewItem,
    };
  }

  componentDidUpdate() {
    localStorage.setItem("cartItems", JSON.stringify(this.state.cart.items));
  }

  // changeUserCurrency = (currency) => {
  //   localStorage.setItem("userCurrency", currency);
  //   this.setState({
  //     userCurrency: currency,
  //     items: this.state.cart.items.map((item) => {
  //       //* update new prices

  //       const currentExchangeRate = this.state.exchangeRates[item.currency];
  //       const newExchangeRate =
  //         this.state.exchangeRates[this.state.labels[currency]];

  //       return {
  //         ...item,
  //         currency,
  //         price: (item.price / currentExchangeRate) * newExchangeRate,
  //       };
  //     }),
  //   });
  // };

  // componentDidMount() {
  //   this.getExchangeRates();
  // }

  // getExchangeRates = () => {
  //   axios
  //     .get(
  //       "https://v6.exchangerate-api.com/v6/f0f758a27327efc4363113d5/latest/USD"
  //     )
  //     .then((response) => {
  //       const data = response.data.conversion_rates;
  //       this.setState({
  //         exchangeRates: {
  //           USD: 1,
  //           EUR: data.EUR,
  //           GBP: data.GBP,
  //           AED: data.AED,
  //           EGP: data.EGP,
  //         },
  //       });
  //     })
  //     .catch((error) => console.error(error));
  // };

  addItem = (product, selectedAttributes) => {
    // * Check if selected attributes are provided
    // * If not, set the first value of each attribute as default (as per the requirements)
    if (!selectedAttributes) {
      selectedAttributes = {};
      product.attributes.forEach((attributeSet) => {
        selectedAttributes[attributeSet.id] = attributeSet.items[0].value;
      });
    }

    // * Check if the item is already in the cart
    const existingItemIndex = this.state.cart.items.findIndex((item) => {
      return (
        item.id === product.id &&
        JSON.stringify(item.selectedAttributes) ===
          JSON.stringify(selectedAttributes)
      );
    });

    if (existingItemIndex !== -1) {
      // * update quantity
      const updatedItems = [...this.state.cart.items];

      updatedItems[existingItemIndex].quantity += 1;

      this.setState((prevState) => ({
        cart: {
          ...prevState.cart,
          items: updatedItems,
        },
      }));
    } else {
      //* get the price as per the user's selection
      // const price = product.prices.find(
      //   (price) => price.currency.symbol === this.state.userCurrency
      // );

      // const exchangeRate =
      //   this.state.exchangeRates[this.state.labels[this.state.userCurrency]];

      // * create new item
      const newItem = {
        id: product.id,
        name: product.name,
        currency: this.state.userCurrency,
        price: product.prices[0].amount,
        attributes: product.attributes,
        quantity: 1,
        image: product.gallery[0],
        selectedAttributes,
      };

      // * add to cart
      this.setState((prevState) => ({
        cart: {
          ...prevState.cart,
          items: [...prevState.cart.items, newItem],
        },
      }));
    }

    //* Inform the user
    toast.success("Added to cart!");
  };

  handleIncrementQuantity = (itemId, selectedAttributes) => {
    const updatedItem = this.state.cart.items.find(
      (item) =>
        item.id === itemId && item.selectedAttributes === selectedAttributes
    );

    if (!updatedItem) {
      toast.error("Internal error!");
      console.error("Item not found in the cart");
      return;
    }

    updatedItem.quantity += 1;

    this.setState((prevState) => ({
      cart: {
        ...prevState.cart,
        items: prevState.cart.items.map((item) =>
          item.id === itemId &&
          Object.keys(selectedAttributes).every(
            (key) => item.selectedAttributes[key] === selectedAttributes[key]
          )
            ? updatedItem
            : item
        ),
      },
    }));
  };

  handleDecrementQuantity = (itemId, selectedAttributes) => {
    const updatedItem = this.state.cart.items.find(
      (item) =>
        item.id === itemId &&
        Object.keys(selectedAttributes).every(
          (key) => item.selectedAttributes[key] === selectedAttributes[key]
        )
    );

    if (!updatedItem) {
      console.error("Item not found in the cart");
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    if (updatedItem.quantity === 1) {
      // * remove item from the cart
      const updatedItems = this.state.cart.items.filter(
        (item) =>
          !(
            item.id === itemId &&
            Object.keys(selectedAttributes).every(
              (key) => item.selectedAttributes[key] === selectedAttributes[key]
            )
          )
      );

      this.setState((prevState) => ({
        cart: {
          ...prevState.cart,
          items: updatedItems,
          // items: [...updatedItems],
        },
      }));
    } else {
      updatedItem.quantity -= 1;

      this.setState((prevState) => ({
        cart: {
          ...prevState.cart,
          items: prevState.cart.items.map((item) =>
            item.id === itemId &&
            Object.keys(selectedAttributes).every(
              (key) => item.selectedAttributes[key] === selectedAttributes[key]
            )
              ? // { ...updatedItem }
                updatedItem
              : item
          ),
        },
      }));
    }
  };

  updateCartWithNewItem = (newItem, currentSelectedAttributes) => {
    this.setState((prevState) => ({
      cart: {
        ...prevState.cart,
        items: this.state.cart.items.map((item) =>
          item.id === newItem.id &&
          Object.keys(currentSelectedAttributes).every(
            (key) =>
              item.selectedAttributes[key] === currentSelectedAttributes[key]
          )
            ? newItem
            : item
        ),
      },
    }));
  };

  render() {
    return (
      <CartContext.Provider value={this.state}>
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
