import Smike from "./Smike"

/** @jsx Smike.createElement */
const element=(
    <div id="foo">
        <a>bar</a>
        <b/>
    </div>
)

const container=document.getElementById("app")
Smike.render(element,container)