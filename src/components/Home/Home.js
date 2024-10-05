// Home.js
// This component is responsible for rendering all the products available in the store.
// It uses the axios library to fetch the products from the server.
// This is the main component that will be rendered when the user visits the home page.

// import styles from "./Home.module.css";
import { Component } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import ProductItem from "../ProductItem/ProductItem";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      isLoading: false,
      axiosError: null,
    };
  }

  componentDidMount() {
    // test server connection
    axios
      .get("https://www.yousseftawfik.com/")
      .then((response) => {
        console.log(response);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        this.setState({ axiosError: error });
      });

    this.fetchAllProducts();
  }

  fetchAllProducts() {
    this.setState({ isLoading: true });
    axios
      .post("https://www.yousseftawfik.com/graphql", {
        query: `
        {
          allProducts {
            id
            name
            category
            brand
            description
            inStock
            gallery
            prices {
              amount
              currency {
                symbol
                label
              }
            }
            attributes {
              id
              type
              items {
                id
                displayValue
                value
              }
            }
          }
        }
      `,
      })
      .then((response) => {
        this.setState({ allProducts: response.data.data.allProducts });
        console.log(this.state.allProducts);
        this.setState({ axiosError: null });
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        this.setState({ axiosError: error });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { axiosError, allProducts, isLoading } = this.state;

    if (isLoading) {
      return (
        <>
          <h2 className="text-4xl mb-5">All Products</h2>
          <Loading />
        </>
      );
    }

    if (axiosError) {
      return (
        <div className="text-red-500">
          There was an error fetching the products: {axiosError.message}
        </div>
      );
    }

    return (
      <div className="container">
        <h2 className="text-4xl mb-5">All Products</h2>
        <div className="grid lg:grid-cols-3 gap-8 md:grid-cols-2 ">
          {allProducts?.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }
}
