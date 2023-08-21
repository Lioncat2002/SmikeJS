import Smike from "./Smike"

/** @jsx Smike.createElement */
const container=document.getElementById("app")

function Counter(){
  const [state,setState]=Smike.useState(1)
  return (
    <h1 onClick={()=>setState(c=>c+1)}>
      Counter: {state}
    </h1>
  )
}


const element = <Counter/>
Smike.render(element, container)



