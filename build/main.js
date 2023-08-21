import Smike from "./Smike";

/** @jsx Smike.createElement */
const container = document.getElementById("app");

function Counter() {
  const [state, setState] = Smike.useState(1);
  return Smike.createElement(
    "h1",
    { onClick: () => setState(c => c + 1) },
    "Counter: ",
    state
  );
}

const element = Smike.createElement(Counter, null);
Smike.render(element, container);