// import styles from "./Layout.module.css";
import { Component } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

export default class Layout extends Component {
  render() {
    return (
      <div className="container  text-mainFontColor font-raleway  px-4">
        <NavBar />
        <main className="py-24">
          <Outlet />
        </main>
        {/* <footer className="text-center bg-zinc-400 p-10 text-white">
          Footer
        </footer> */}
      </div>
    );
  }
}
