// import styles from "./Home.module.css";
import { Component } from "react";
import axios from "axios";
import ProductListing from "../ProductListing/ProductListing";
import Loading from "../Loading/Loading";

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
    // test backend connection
    axios
      .get("https://www.yousseftawfik.com/")
      // .get("http://localhost:8000/")
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
      // .post("http://localhost:8000/graphql", {
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

    return (
      <div className="container">
        <h2 className="text-4xl mb-5">All Products</h2>
        {axiosError ? (
          <div className="text-red-500">
            There was an error fetching the products: {axiosError.message}
          </div>
        ) : (
          <ProductListing products={allProducts} />
        )}
      </div>
    );
  }
}
