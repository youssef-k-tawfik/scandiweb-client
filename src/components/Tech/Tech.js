// Tech.js
// This component is responsible for rendering the tech products.
// It uses the axios library to fetch the tech products from the server.

// import styles from "./Tech.module.css";
import { Component } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import ProductItem from "../ProductItem/ProductItem";

export default class Tech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      techProducts: [],
      isLoading: false,
      axiosError: null,
    };
  }

  // Fetches the tech products from the server when the component mounts
  componentDidMount() {
    this.fetchTechProducts();
  }

  // Fetches the tech products from the server
  fetchTechProducts() {
    this.setState({ isLoading: true });

    axios
      .post("https://www.yousseftawfik.com/graphql", {
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

    if (axiosError) {
      return (
        <div className="container">
          <h2 className="text-4xl mb-5">Tech Products</h2>
          <div className="text-red-500">
            There was an error fetching tech products: {axiosError.message}
          </div>
        </div>
      );
    }

    return (
      <div className="container ">
        <h2 className="text-4xl mb-5">Tech Products</h2>
        <div className="grid lg:grid-cols-3 gap-8 md:grid-cols-2 ">
          {techProducts?.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }
}
