function createElement(type,props,...children){
    return{
        type,
        props:{
            ...props,
            children: children.map(child=>
                typeof child==="object"?child:createTextElement(child)
                ),
        },
    }
}

function createTextElement(text){
    return {
        type: "TEXT_ELEMENT",
        props:{
            nodeValue:text,
            children:[],
        }
    }
}

function createDom(fiber){
    const dom = element.type=="TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
    
    const isProperty=key=>key!=="children"

    Object.keys(element.props)
    .filter(isProperty)
    .forEach(name=>{
        dom[name]=element.props[name]
    })
    return dom
}

function render(element,container){
    //handling text elements
    nextUnitOfWork={
        dom:container,
        props:{
            children:[element]
        }
    }
}

let nextUnitOfWork=null
/**
 * Needed for dividing the rendering of dom elements
 * into smaller parts so that browser can handle higher priority
 * stuff
 * @param deadline tells how much time is remaining until
 * the browser takes control again
 */

function workLoop(deadline){
    let shouldYeild=false
    while(nextUnitOfWork && !shouldYeild){
        nextUnitOfWork=performUnitOfWork(
            nextUnitOfWork
        )
        shouldYeild=deadline.timeRemaining()<1
    }
    requestIdleCallback(workLoop)//internal function called by the browser
    //works like setTimeout but browser controls it
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber){
    if(!fiber.dom){
        fiber.dom=createDom(fiber)
    }
    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }

    const elements=fiber.props.children
    let index=0
    let prevSibling=null

    while(index<elements.length){
        const element=elements[index]

        const newFiber={
            type:element.type,
            props:element.props,
            parent:fiber,
            dom:null
        }
        if(index===0){
            fiber.child=newFiber
        }else{
            prevSibling.sibling=newFiber
        }
        prevSibling=newFiber
        index++
    }

    if(fiber.child){
        return fiber.child
    }
    let nextFiber=fiber
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        }
        nextFiber=nextFiber.parent
    }
}

const Smike={
    createElement,
    render
}

export default Smike