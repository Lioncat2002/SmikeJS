import Smike from "../Smike";

/** @jsx Smike.createElement */
const element = Smike.createElement(
    "div",
    { id: "foo" },
    Smike.createElement(
        "a",
        null,
        "bar"
    ),
    Smike.createElement("b", null)
);

const container = document.getElementById("app");
Smike.render(element, container);