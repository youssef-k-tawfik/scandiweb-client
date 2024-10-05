// NotFound.js
// This component is responsible for rendering the 404 page.
// It will be rendered when the user visits a page that does not exist.

// import styles from "./NotFound.module.css";
import { Component } from "react";

export default class NotFound extends Component {
  render() {
    return (
      <div className="text-center text-3xl my-20 font-sans">
        <h2>404</h2>
        <br />
        <p>Page not found!</p>
      </div>
    );
  }
}
