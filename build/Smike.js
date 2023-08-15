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
    const dom = fiber.type=="TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)
    updateDom(dom,{},fiber.props)
    /* 
    const isProperty=key=>key!=="children"

    Object.keys(element.props)
    .filter(isProperty)
    .forEach(name=>{
        dom[name]=element.props[name]
    }) */
    return dom
}

//if prop name starts with "on" for event listeners
const isEvent=key=>key.startsWith("on")
const isProperty=key=>key!=="children" && !isEvent(key)
const isNew=(prev,next)=>key=>prev[key]!==next[key]
const isGone=(prev,next)=>key=>!(key in next)

function updateDom(dom,prevProps,nextProps){
    //remove old or changed event listeners
    Object.keys(prevProps)
    .filter(isEvent)
    .filter(
        key=>!(key in nextProps)||isNew(prevProps,nextProps)(key)
    ).forEach(name=>{
        const eventType=name.toLowerCase().substring(2)
        dom.removeEventListener(
            eventType,
            prevProps[name]
        )
    })
    //remove old properties
    Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps,nextProps))
    .forEach(name=>{
        dom[name]=""
    })

    //set new or changed properties
    Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps,nextProps))
    .forEach(name=>{
        dom[name]=nextProps[name]
    })

    //add new event listeners
    Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps,nextProps))
    .forEach(name=>{
        const eventType=name.toLowerCase().substring(2)
        dom.addEventListener(eventType,nextProps[name])
    })

}

function commitRoot(){
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot=wipRoot
    wipRoot=null
}

function commitWork(fiber){
    if(!fiber){
        return
    }

    const domParent=fiber.parent.dom
    if(fiber.effectTag==="PLACEMENT"&&fiber.dom!=null){
        domParent.appendChild(fiber.dom)
    }
    else if(fiber.effectTag==="UPDATE"&&fiber.dom!=null){
        updateDom(
            fiber.dom,
            fiber.alternate.props,
            fiber.props
        )
    }
    else if(fiber.effectTag==="DELETION"){
        domParent.removeChild(fiber.dom)
    }
    
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function render(element,container){
    //handling text elements
    wipRoot={
        dom:container,
        props:{
            children:[element],
        },
        alternate: currentRoot
    }
    deletions=[]
    nextUnitOfWork=wipRoot
}

let nextUnitOfWork=null
let currentRoot=null
let wipRoot=null
let deletions=null
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
        nextUnitOfWork=performUnitOfWork(nextUnitOfWork)
        shouldYeild=deadline.timeRemaining()<1
    }
    if(!nextUnitOfWork && wipRoot){
        commitRoot()
    }
    requestIdleCallback(workLoop)//internal function called by the browser
    //works like setTimeout but browser controls it
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber){
    if(!fiber.dom){
        fiber.dom=createDom(fiber)
    }

    const elements=fiber.props.children
    reconsileChildren(fiber,elements)
    
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

function reconsileChildren(wipFiber,elements){
    let index=0
    let oldFiber=wipFiber.alternate && wipFiber.alternate.child
    let prevSibling=null

    while(index<elements.length||oldFiber!=null){
        const element=elements[index]
        let newFiber=null
        const sameType=oldFiber&&element&&element.type==oldFiber.type
        if(sameType){
            //update node
            newFiber={
                type:oldFiber.type,
                props:element.props,
                dom:oldFiber.dom,
                parent:wipFiber,
                alternate:oldFiber,
                effectTag:"UPDATE"
            }
        }
        if(element&&!sameType){
            //add node
            newFiber={
                type:element.type,
                props:element.props,
                dom:null,
                parent:wipFiber,
                alternate:null,
                effectTag:"PLACEMENT"
            }
        }
        if(oldFiber&&!sameType){
            //delete node
            oldFiber.effectTag="DELETION"
            deletions.push(oldFiber)
        }
        if(oldFiber){
            oldFiber=oldFiber.sibling
        }
        if(index===0){
            wipFiber.child=newFiber
        }else{
            prevSibling.sibling=newFiber
        }
        prevSibling=newFiber
        index++
    }

}

const Smike={
    createElement,
    render
}

export default Smike