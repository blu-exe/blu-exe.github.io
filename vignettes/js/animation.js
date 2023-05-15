const seven = document.getElementById('seven')
const yifang = document.getElementById('yifang')
const northbranch = document.getElementById('northbranch')
const mutually = document.getElementById('mutually')
const boundingBox = document.querySelector('.bounding')


// animation loop
function animate(time) {
	requestAnimationFrame(animate)
	TWEEN.update(time)
}
requestAnimationFrame(animate)

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function getSize(elem) {
    elemSize = elem.getBoundingClientRect()
    height = elemSize.bottom - elemSize.top
    width = elemSize.right - elemSize.left
    return [height, width]
}

function getFinalCoords(elem) { //how tf do u write this better w/o writing everything twice
    const yBoundingCenter = getSize(boundingBox)[0]/2
    const xBoundingCenter = getSize(boundingBox)[1]/2
    const boundingCoords = boundingBox.getBoundingClientRect()
    const initialCoords = elem.getBoundingClientRect()
    var yInitial = initialCoords.top - boundingCoords.top
    var xInitial = initialCoords.left - boundingCoords.left

    var yFinal = yBoundingCenter - yInitial - getSize(elem)[0]/2
    var xFinal = xBoundingCenter - xInitial - getSize(elem)[1]/2
    var yCenter = yBoundingCenter + boundingCoords.top
    var xCenter = xBoundingCenter + boundingCoords.left

    return {"xRel": xFinal, "yRel": yFinal, "yCenter": yCenter, "xCenter": xCenter}
}

function focus(elem) {
    //set z-axis priority
    elem.style.setProperty("z-index", 300)

    //animate image movement to center
    var finalCoords = getFinalCoords(elem)
    console.log(finalCoords)
    const coords = {x: 0, y: 0}
    const tween1 = new TWEEN.Tween(coords)
        .to({x: finalCoords.xRel, y: finalCoords.yRel}, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            elem.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`)
        })
        .start()

    //suck in
    const initialHeight = getComputedStyle(elem).height.slice(0, -2)
    const initialWidth = getComputedStyle(elem).width.slice(0, -2)
    console.log(initialHeight, initialWidth)
    var size = {height: initialHeight, width: initialWidth}
    const tween0 = new TWEEN.Tween(size)
        .to({height: initialHeight - initialHeight/8, width: initialWidth - initialWidth/8}, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            elem.style.setProperty("height", `${size.height}px`, "important")
            elem.style.setProperty("width", `${size.width}px`, "important")
        })
        .start()
    
    delay(1000).then(() =>{

        // blow up using JS
        // const initialHeight = getComputedStyle(elem).height.slice(0, -2)
        // const initialWidth = getComputedStyle(elem).width.slice(0, -2)
        // console.log(initialHeight, initialWidth)
        // var size = {height: initialHeight, width: initialWidth}
        // const tween0 = new TWEEN.Tween(size)
        //     .to({height: initialHeight*2.3, width: initialWidth*2.3}, 10000)
        //     .easing(TWEEN.Easing.Quadratic.Out)
        //     .onUpdate(() => {
        //         var newHeight = size.height
        //         var newWidth = size.width
        //         elem.style.setProperty("height", `${newHeight}px`, "important")
        //         elem.style.setProperty("width", `${newWidth}px`, "important")
        //         // var offset = getFinalCoords(elem)
        //         // elem.style.setProperty('transform', `translate(${offset.xRel}px, ${offset.yRel}px)`)
        //         // console.log("update: " + `${size.height}px`,`${size.width}px`)
        //         // console.log("actual: " + getComputedStyle(elem).height, getComputedStyle(elem).width)
        //     })
        //     .start()

        //spawn svg
        var spawnLocation = document.querySelector(".spawnCircle")
        spawnLocation.innerHTML = "<svg height='800' width='800' class='svg'> <circle class='circle' cx='0' cy='0' r='10' stroke='gray' stroke-width='2' fill='gray'/> </svg>"
        const circle = document.querySelector(".circle")
        const svg = document.querySelector(".svg")

        //position svg over entire viewport
        svg.style.setProperty("position", "absolute")
        svg.style.setProperty("left", "0")
        svg.style.setProperty("top", "0")
        svg.setAttribute("height", `${window.innerHeight}`)
        svg.setAttribute("width", `${window.innerWidth}`)
        circle.setAttribute("cx", `${finalCoords.xCenter}`)
        circle.setAttribute("cy", `${finalCoords.yCenter}`)

        //animate circle
        document.querySelector(".svg").style.setProperty("z-index", 200)
        var radius = {r : circle.getAttribute("r")}
        const tween2 = new TWEEN.Tween(radius)
            .to({r:1000}, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                circle.setAttribute("r", radius.r)
            })
            .start()
        
        elem.classList.toggle("expand")

    }) 


}


$(document).ready(function() {
    // on click, animate
    $('div.cell').click(function(e) {
        var idClicked = e.target.id;
        console.log("focusing " + idClicked)
        focus(document.getElementById(idClicked))
    });
});




