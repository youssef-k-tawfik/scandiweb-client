// import axios from "axios";
import axios from "axios";
import { Component, createContext } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export default class CartProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // userCurrency: localStorage.getItem("userCurrency") || "USD",
      items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
      showCart: false,
      placeOrderLoading: false,
    };
  }

  componentDidUpdate(_, prevState) {
    if (prevState.items !== this.state.items) {
      localStorage.setItem("cartItems", JSON.stringify(this.state.items));
    }
  }

  // changeUserCurrency = (currency) => {
  //   localStorage.setItem("userCurrency", currency);
  //   this.setState({
  //     userCurrency: currency,
  //     items: this.state.items.map((item) => {
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

  toggleShowCart = () => this.setState({ showCart: !this.state.showCart });

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
    const existingItemIndex = this.state.items.findIndex((item) => {
      return (
        item.id === product.id &&
        Object.keys(selectedAttributes).every(
          (key) => item.selectedAttributes[key] === selectedAttributes[key]
        )
      );
    });

    if (existingItemIndex !== -1) {
      // * update quantity
      const updatedItems = [...this.state.items];

      updatedItems[existingItemIndex].quantity += 1;

      this.setState({ items: updatedItems });
    } else {
      //* get the price as per the user's selection

      // * create new item
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.prices[0].amount,
        attributes: product.attributes,
        quantity: 1,
        image: product.gallery[0],
        selectedAttributes,
      };

      // * add to cart
      this.setState((prevState) => ({
        items: [...prevState.items, newItem],
      }));
    }

    //* Inform the user
    toast.success("Added to cart!");
  };

  handleIncrementQuantity = (itemId, selectedAttributes) => {
    const updatedItem = this.state.items.find(
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
      items: prevState.items.map((item) =>
        item.id === itemId &&
        Object.keys(selectedAttributes).every(
          (key) => item.selectedAttributes[key] === selectedAttributes[key]
        )
          ? updatedItem
          : item
      ),
    }));
  };

  handleDecrementQuantity = (itemId, selectedAttributes) => {
    const updatedItem = this.state.items.find(
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
      const updatedItems = this.state.items.filter(
        (item) =>
          !(
            item.id === itemId &&
            Object.keys(selectedAttributes).every(
              (key) => item.selectedAttributes[key] === selectedAttributes[key]
            )
          )
      );

      this.setState({ items: updatedItems });
    } else {
      updatedItem.quantity -= 1;

      this.setState((prevState) => ({
        items: prevState.items.map((item) =>
          item.id === itemId &&
          Object.keys(selectedAttributes).every(
            (key) => item.selectedAttributes[key] === selectedAttributes[key]
          )
            ? updatedItem
            : item
        ),
      }));
    }
  };

  placeOrder = () => {
    this.setState({ placeOrderLoading: true });
    console.log("Placing order...");

    const query = `
      mutation PlaceOrder($orderItems: [OrderItemInput!]!) {
        placeOrder(orderItems: $orderItems) {
          order_number
        }
      }
    `;

    const variables = {
      orderItems: this.state.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        selectedAttributes: Object.keys(item.selectedAttributes).map((key) => ({
          id: key,
          value: item.selectedAttributes[key],
        })),
      })),
    };

    // * send order to the server
    axios
      .post(
        // "http://localhost:8000/graphql",
        "https://www.yousseftawfik.com/graphql",
        { query, variables }
      )
      .then((response) => {
        console.log("response: ", response);

        const orderNumber = response.data.data.placeOrder.order_number;
        if (orderNumber === "0") {
          toast.error("Order wasn't placed successfully!");
        } else {
          toast.success(
            `Order placed successfully! Order number: ${orderNumber}`
          );
          this.setState({ items: [], showCart: false });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong. Please try again later.");
      }).finally(() => {
        this.setState({ placeOrderLoading: false });
      });
  };

  // updateCartWithNewItem = (newItem, currentSelectedAttributes) => {
  //   this.setState({
  //     items: this.state.items.map((item) =>
  //       item.id === newItem.id &&
  //       Object.keys(currentSelectedAttributes).every(
  //         (key) =>
  //           item.selectedAttributes[key] === currentSelectedAttributes[key]
  //       )
  //         ? newItem
  //         : item
  //     ),
  //   });
  // };

  render() {
    return (
      <CartContext.Provider
        value={{
          ...this.state,
          toggleShowCart: this.toggleShowCart,
          addItem: this.addItem,
          handleIncrementQuantity: this.handleIncrementQuantity,
          handleDecrementQuantity: this.handleDecrementQuantity,
          placeOrder: this.placeOrder,
          // updateCartWithNewItem: this.updateCartWithNewItem,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}
