import Smike from "./Smike"

/** @jsx Smike.createElement */
const container=document.getElementById("app")
const updateValue = e => {
    rerender(e.target.value)
  }
  
  const rerender = value => {
    const element = (
      <div>
        <input onInput={updateValue} value={value} />
        <h2>Hello {value}</h2>
      </div>
    )
    Smike.render(element, container)
  }
  
  rerender("Smike")


