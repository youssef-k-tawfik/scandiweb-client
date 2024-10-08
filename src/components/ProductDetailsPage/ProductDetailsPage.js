// ProductDetailsPage.js
// This component is responsible for rendering the product details page.
// It uses the axios library to fetch the product details from the server using the id passed in the URL.
// It uses allAttributesSelected state to determine whether to disable the "Add to Cart" button.
// It uses the main image as a hidden placeholder to set the height of the selected image.

// ^ Requirements Enhancement: Remove navigation buttons from the image gallery if there is only one image.
// ^ Requirements Enhancement: Displaying the product with the first attribute of each set selected by default for the user to add to the cart faster.

import styles from "./ProductDetailsPage.module.css";
import axios from "axios";
import React, { Component } from "react";
import Loading from "../Loading/Loading";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import HTMLReactParser from "html-react-parser/lib/index";
import { CartContext } from "../../contexts/CartContext";
import Attributes from "../Attributes/Attributes";

export default class ProductDetailsPage extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);

    this.state = {
      id: window.location.href.split("/").at(-1),
      axiosError: null,
      isLoading: false,
      ProductDetails: {},
      selectedAttributes: {},
      allAttributesSelected: false,
      selectedImage: 0,
      galleryCount: 0,
      mainImageHeight: 0,
    };
    this.abortController = new AbortController();
  }

  // Fetching the product details from the server once the component is mounted
  componentDidMount() {
    this.fetchProduct();
  }

  // Update the allAttributesSelected state when the selectedAttributes state changes
  // This is used to determine whether to disable the "Add to Cart" button
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedAttributes !== this.state.selectedAttributes) {
      this.setState({
        allAttributesSelected: Object.values(
          this.state.selectedAttributes
        ).every((val) => val !== null),
      });
    }
  }

  /**
   * Fetches the product details from the server using the product id
   */
  fetchProduct() {
    this.setState({ isLoading: true });

    const query = `
      query GetProductById($id: String!) {
        productById(id: $id) {
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
    `;

    const variables = {
      id: this.state.id,
    };

    console.log("querying product with id:", this.state.id);

    axios
      .post(
        "https://www.yousseftawfik.com/graphql",
        {
          query,
          variables,
        },
        { signal: this.abortController.signal }
      )
      .then((response) => {
        this.setState({
          ProductDetails: response.data.data.productById,
          axiosError: null,
          galleryCount: response.data.data.productById.gallery.length,
        });
        console.log("Product fetched:", response.data.data.productById);
        this.storeDefaultAttributesValues(
          response.data.data.productById.attributes
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        this.setState({ axiosError: error });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  /**
   * Stores the default values for the product's attributes.
   *
   * This method initializes the `selectedAttributes` object with `null` values for each attribute's ID.
   *
   * @param {Array} attributes - The array of attribute objects. Each attribute object should have an `id` and an `items` array.
   */
  storeDefaultAttributesValues(attributes) {
    const selectedAttributes = {};
    attributes?.forEach((attr) => {
      // selectedAttributes[attr.id] = attr.items[0].value;
      selectedAttributes[attr.id] = null;
    });
    this.setState({ selectedAttributes });
  }

  /**
   * Handles the click event for selecting an attribute.
   *
   * @param {string} id - The ID of the attribute.
   * @param {string} value - The value of the attribute.
   */
  handleAttributeClick = (id, value) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [id]: value,
      },
    }));
  };

  /**
   * Advances to the next image in the gallery.
   */
  nextImage = () => {
    this.setState((prevState) => ({
      selectedImage: (prevState.selectedImage + 1) % prevState.galleryCount,
    }));
  };

  /**
   * Goes back to the previous image in the gallery.
   */
  prevImage = () => {
    this.setState((prevState) => ({
      selectedImage:
        (prevState.selectedImage - 1 + prevState.galleryCount) %
        prevState.galleryCount,
    }));
  };

  /**
   * Handles the image load event to set the main image height.
   *
   * @param {number} mainImageHeight - The height of the main image.
   */
  handleImageLoad = (mainImageHeight) => {
    this.setState({ mainImageHeight });
  };

  render() {
    const {
      ProductDetails,
      selectedImage,
      isLoading,
      axiosError,
      selectedAttributes,
      allAttributesSelected,
      mainImageHeight,
    } = this.state;

    const { addItem, toggleShowCart } = this.context;

    if (isLoading) {
      return <Loading />;
    }

    if (axiosError) {
      return (
        <>
         {/* <h2>There was an error fetching the product</h2>
          <p className="text-red-600">Error Message: {axiosError.message}</p> */}
          <h2 className="text-red-600 font-bold">Product not Found!</h2>
        </>
      );
    }

    const {
      // id,
      name,
      //  brand,
      description,
      gallery,
      prices,
      attributes,
      inStock,
    } = ProductDetails;

    return (
      <>
        <div className="flex flex-col-reverse md:flex-row gap-4 items-center md:items-start">
          {/* /* Image gallery */}
          <div className="w-2/3 flex justify-around">
            {/* all images */}
            <div
              className="w-1/6 flex flex-col gap-2 overflow-y-auto p-2 scrollbar"
              style={{ height: `${mainImageHeight}px` }}
              data-testid="product-gallery"
            >
              {gallery?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="product"
                  className="w-full object-cover object-top transition-all cursor-pointer"
                  onClick={() => this.setState({ selectedImage: index })}
                />
              ))}
            </div>
            {/* Selected Image */}
            <div
              className="w-2/3 relative flex items-center"
              style={{ height: `${mainImageHeight}px` }}
            >
              {/* main image */}
              <img
                src={gallery?.[0]}
                alt="product"
                className="w-full object-contain"
                style={{ visibility: "hidden", position: "absolute" }}
                onLoad={(e) =>
                  this.setState({ mainImageHeight: e.target.clientHeight })
                }
              />
              {/* displayed image */}
              <img
                src={gallery?.[selectedImage]}
                alt="product"
                className="w-full object-contain"
              />
              {/* {gallery?.length > 1 && ( */}
              <>
                <button
                  className="bg-black bg-opacity-70 p-2 absolute top-1/2 start-4 -translate-y-1/2"
                  onClick={this.prevImage}
                >
                  <FaChevronLeft className="text-white" />
                </button>
                <button
                  className="bg-black bg-opacity-70 p-2 absolute top-1/2 end-4 -translate-y-1/2"
                  onClick={this.nextImage}
                >
                  <FaChevronRight className="text-white" />
                </button>
              </>
              {/* )} */}
            </div>
          </div>
          {/* Product details */}
          <div className="w-1/3">
            <h2 className="text-3xl font-semibold mb-2">{name}</h2>

            {/* Attributes */}
            <Attributes
              handleAttributeClick={this.handleAttributeClick}
              attributes={attributes}
              selectedAttributes={selectedAttributes}
              bigSubHeadings={true}
              clickable={true}
            />
            <h3 className={styles["sub-heading"]}>PRICE:</h3>
            <p className="text-2xl font-bold">
              {`${prices?.[0].currency.symbol}${prices?.[0].amount}`}
            </p>

            <button
              data-testid="add-to-cart"
              disabled={!allAttributesSelected || !inStock}
              className="bg-green-400 text-white py-4 w-full my-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => {
                addItem(ProductDetails, selectedAttributes);
                toggleShowCart();
              }}
              title={
                inStock && !allAttributesSelected
                  ? "Please select all variants first"
                  : ""
              }
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            <p
              className="font-roboto product-description"
              data-testid="product-description"
            >
              {HTMLReactParser(String(description))}
            </p>
          </div>
        </div>
      </>
    );
  }
}
