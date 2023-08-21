import Smike from "./Smike";

/** @jsx Smike.createElement */
const container = document.getElementById("app");
const updateValue = e => {
  rerender(e.target.value);
};

const rerender = value => {
  function B(props) {
    return Smike.createElement(
      "div",
      null,
      props.name
    );
  }
  function App(props) {
    return Smike.createElement(
      "h1",
      null,
      "Hi",
      props.name
    );
  }
  const element = Smike.createElement(App, { name: "meow" }); /* (
                                                              <div>
                                                              <input onInput={updateValue} value={value} className="tigercat" style={{background:"white"}}/>
                                                              <h2>Hello {value}</h2>
                                                              </div>
                                                              ) */
  Smike.render(element, container);
};

rerender("Smike");