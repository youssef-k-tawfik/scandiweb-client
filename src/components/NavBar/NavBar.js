import { Component } from "react";
import { BsCart } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import Logo from "../Logo";
import { CartContext } from "../../contexts/CartContext";
import Cart from "../Cart/Cart";

export default class NavBar extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      activeLink: "",
    };
  }

  componentDidMount() {
    const { pathname } = window.location;
    this.setState({
      activeLink: pathname === "/" ? "/all" : pathname,
    });
  }

  // handleCurrencyChange = (e) => {
  //   const { changeUserCurrency } = this.context;
  //   changeUserCurrency(e.target.value);
  // };

  render() {
    const { activeLink } = this.state;

    // const { userCurrency } = this.context;
    const { cart, showCart, toggleShowCart } = this.context;

    const totalQuantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    const links = [
      { path: "/all", label: "All" },
      { path: "/tech", label: "Tech" },
      { path: "/clothes", label: "Clothes" },
    ];
    console.log("activeLink:", activeLink);

    return (
      <div className="fixed top-0 start-0 end-0 shadow z-20 bg-white">
        <div className="container mx-auto flex justify-between items-center ">
          <nav className="">
            <ul className="flex gap-4 items-center">
              {links.map((link) => (
                <li key={link.path} className="py-4">
                  <NavLink
                    to={link.path}
                    className="p-4 font-semibold"
                    data-testid={
                      activeLink === link.path
                        ? "active-category-link"
                        : "category-link"
                    }
                    // data-test={({ isActive }) =>
                    //   isActive ? "active-category-link" : "category-link"
                    // }
                    onClick={() => this.setState({ activeLink: link.path })}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Logo />
          <div className="relative p-2">
            <div className="relative flex gap-2 items-center">
              {/* <select
                className="p-2 border rounded"
                onChange={this.handleCurrencyChange}
                value={userCurrency}
              >
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
                <option value="AED ">AED</option>
                <option value="EGP ">EGP</option>
              </select> */}
              <button
                // onClick={() => this.setState({ showCart: !showCart })}
                onClick={toggleShowCart}
                // data-testid="cart-btn"
                data-testid="cart-overlay"
              >
                <BsCart className="text-2xl mx-2 cursor-pointer" />
              </button>
              {totalQuantity > 0 && (
                <div className="absolute top-0 end-0 -translate-y-1/2 bg-black text-white text-sm font-bold font-roboto rounded-full size-6 flex items-center justify-center">
                  {totalQuantity}
                </div>
              )}
            </div>
            {showCart && (
              <div className="bg-white absolute top-full end-0 z-10 p-4">
                <Cart />
              </div>
            )}
          </div>
        </div>
        {showCart && (
          <div
            className="fixed bottom-0 start-0 end-0 top-14 bg-gray-800 bg-opacity-50"
            // onClick={() => this.setState({ showCart: !showCart })}
            onClick={toggleShowCart}
          />
        )}
      </div>
    );
  }
}
