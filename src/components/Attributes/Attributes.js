// Attributes.js
// This component is responsible for rendering product attributes and handling attribute selection.
// It receives various props to render different types of attributes (PDP & Cart Item).

import styles from "./Attributes.module.css";
import { Component } from "react";

export default class Attributes extends Component {
  render() {
    const {
      attributes,
      selectedAttributes,
      colorAttributeSize,
      cartAttribute,
      bigSubHeadings,
      handleAttributeClick,
      clickable,
    } = this.props;

    return (
      <div>
        {attributes?.map((attributeSet) => (
          <div key={attributeSet.id} className="mb-4">
            <h3
              className={`font-robotoCondensed mb-1 text-nowrap ${
                bigSubHeadings ? "uppercase font-bold" : ""
              }`}
            >
              {attributeSet.id}:
            </h3>
            <div
              className="flex gap-2 flex-nowrap"
              data-testid={`product-attribute-${attributeSet.id
                .split(" ")
                .join("-")
                .toLowerCase()}`}
            >
              {attributeSet.items.map((item) =>
                // * Render color attribute as a colored box
                attributeSet.id === "Color" ? (
                  <label
                    key={item.value}
                    className={` border-2 p-[2px] size-${
                      colorAttributeSize || 10
                    } ${
                      item.value === selectedAttributes[attributeSet.id]
                        ? "border-green-400"
                        : ""
                    } ${
                      clickable ? "hover:border-green-400 cursor-pointer" : ""
                    } flex items-center justify-center`}
                    title={item.displayValue}
                    data-testid={`product-attribute-color-${item.id}`}
                  >
                    <input
                      type="radio"
                      name={attributeSet.id}
                      value={item.value}
                      checked={
                        item.value === selectedAttributes[attributeSet.id]
                      }
                      disabled={!clickable}
                      onChange={() =>
                        handleAttributeClick(attributeSet.id, item.value)
                      }
                      className="hidden"
                    />
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: item.value }}
                    ></div>
                  </label>
                ) : (
                  // * Render other attributes as labels with radio inputs
                  <label
                    key={item.value}
                    className={`border border-black min-w-fit min-h-fit px-1  flex items-center justify-center font-sans ${
                      cartAttribute ? `size-10` : "size-16"
                    } ${
                      item.value === selectedAttributes[attributeSet.id]
                        ? styles["selected-attribute"]
                        : ""
                    } ${clickable ? "cursor-pointer" : ""}`}
                    data-testid={`product-attribute-${attributeSet.id
                      .split(" ")
                      .join("-")
                      .toLowerCase()}-${item.id}`}
                  >
                    <input
                      type="radio"
                      name={attributeSet.id}
                      value={item.value}
                      checked={
                        item.value === selectedAttributes[attributeSet.id]
                      }
                      disabled={!clickable}
                      onChange={() =>
                        handleAttributeClick(attributeSet.id, item.value)
                      }
                      className="hidden"
                    />
                    {item.value}
                  </label>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
