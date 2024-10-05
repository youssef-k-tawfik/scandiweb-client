// Clothes.js
// This component is responsible for rendering the clothes products.
// It uses the axios library to fetch the clothes products from the server.

// import styles from "./Clothes.module.css";
import { Component } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import ProductItem from "../ProductItem/ProductItem";

export default class Clothes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clothesProducts: [],
      isLoading: false,
      axiosError: null,
    };
  }

  // Fetches the clothes products from the server when the component mounts
  componentDidMount() {
    this.fetchClothesProducts();
  }

  // Fetches the clothes products from the server
  fetchClothesProducts() {
    this.setState({ isLoading: true });

    axios
      .post("https://www.yousseftawfik.com/graphql", {
        query: `
        {
          clothesProducts {
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
        this.setState({ clothesProducts: response.data.data.clothesProducts });
        console.log(this.state.clothesProducts);
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
    const { axiosError, clothesProducts, isLoading } = this.state;

    if (isLoading) {
      return (
        <>
          <h2 className="text-4xl mb-5">Clothes Products</h2>
          <Loading />
        </>
      );
    }

    if (axiosError) {
      return (
        <div className="container">
          <h2 className="text-4xl mb-5">Clothes Products</h2>
          <div className="text-red-500">
            There was an error fetching clothes products: {axiosError.message}
          </div>
        </div>
      );
    }

    return (
      <div className="container ">
        <h2 className="text-4xl mb-5">Clothes Products</h2>
        <div className="grid lg:grid-cols-3 gap-8 md:grid-cols-2 ">
          {clothesProducts?.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }
}
