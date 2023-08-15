import Smike from "./Smike";

/** @jsx Smike.createElement */
const container = document.getElementById("app");
const updateValue = e => {
  rerender(e.target.value);
};

const rerender = value => {
  const element = Smike.createElement(
    "div",
    null,
    Smike.createElement("input", { onInput: updateValue, value: value }),
    Smike.createElement(
      "h2",
      null,
      "Hello ",
      value
    )
  );
  Smike.render(element, container);
};

rerender("Smike");