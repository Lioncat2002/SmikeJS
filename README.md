# SmikeJS
> SmikeJS is a react-esque jsx framework which lets you make frontend applications super fast!
## Usage:
To use SmikeJS, just drop in the Smike.js file into your project and you will be ready to go!

## Example:
### SmikeJS Counter App:
```js
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
```
