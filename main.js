import Smike from "./Smike"

/** @jsx Smike.createElement */
const container=document.getElementById("app")
const updateValue = e => {
    rerender(e.target.value)
  }
  
  const rerender = value => {
    function B(props){
      return <div>{props.name}</div>
    }
    function App(props){
        return <h1>Hi{props.name}</h1>
    }
    const element = <App name={"meow"}/>/* (
      <div>
        <input onInput={updateValue} value={value} className="tigercat" style={{background:"white"}}/>
        <h2>Hello {value}</h2>
      </div>
    ) */
    Smike.render(element, container)
  }
  
  rerender("Smike")


