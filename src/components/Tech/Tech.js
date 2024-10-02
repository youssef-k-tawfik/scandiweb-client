// import styles from "./Tech.module.css";
import { Component } from "react";
import ProductListing from "../ProductListing/ProductListing";
import axios from "axios";
import Loading from "../Loading/Loading";

export default class Tech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      techProducts: [],
      isLoading: false,
      axiosError: null,
    };
  }

  componentDidMount() {
    this.fetchTechProducts();
  }

  fetchTechProducts() {
    this.setState({ isLoading: true });

    axios
      .post("https://www.yousseftawfik.com/graphql", {
      // .post("http://localhost:8000/graphql", {
        query: `
        {
          techProducts {
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
        this.setState({
          techProducts: response?.data?.data?.techProducts,
          axiosError: null,
        });
        console.log(this.state.techProducts);
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
    const { axiosError, techProducts, isLoading } = this.state;

    if (isLoading) {
      return (
        <>
          <h2 className="text-4xl mb-5">Tech Products</h2>
          <Loading />
        </>
      );
    }

    return (
      <div className="container ">
        <h2 className="text-4xl mb-5">Tech Products</h2>
        {axiosError ? (
          <div>
            There was an error fetching the products: {axiosError.message}
          </div>
        ) : (
          <ProductListing products={techProducts} />
        )}
      </div>
    );
  }
}
