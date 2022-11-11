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


function getSize(elem) {
    elemSize = elem.getBoundingClientRect()
    height = elemSize.bottom - elemSize.top
    width = elemSize.right - elemSize.left
    return [height, width]
}

function getFinalCoords(elem) {
    const yBoundingCenter = getSize(boundingBox)[0]/2
    const xBoundingCenter = getSize(boundingBox)[1]/2
    const initialCoords = elem.getBoundingClientRect()
    var xInitial = initialCoords.left
    var yInitial = initialCoords.top
    var yFinal = yBoundingCenter - yInitial
    var xFinal = xBoundingCenter - xInitial
    return [xFinal, yFinal]
}

function focus(elem) {
    //animate image movement
    var finalCoords = getFinalCoords(elem)
    const coords = {x: 0, y: 0}
    const tween1 = new TWEEN.Tween(coords)
        .to({x: finalCoords[0], y: finalCoords[1]}, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            elem.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`)
        })
        .start()
    
    //animate expanding circle
    var spawnLocation = document.querySelector(".spawnCircle")
    spawnLocation.innerHTML = "<svg height='700' width='700' class='svg'> <circle class='circle' cx='200' cy='200' r='10' stroke='gray' stroke-width='2' fill='green'/> </svg>"
    const circle = document.querySelector(".circle")
    var radius = {r : circle.getAttribute("r")}
    const tween2 = new TWEEN.Tween(radius)
        .to({r:200}, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            circle.setAttribute("r", radius.r)
        })
        .start()
}
 


$(document).ready(function() {
    // on click, animate
    $('div.cell').click(function(e) {
        var idClicked = e.target.id;
        console.log("focusing " + idClicked)
        focus(document.getElementById(idClicked))
    });

    $('circle.circle').click(function(){
        const circle = document.querySelector(".circle")
        var radius = {r : circle.getAttribute("r")}
        const tween = new TWEEN.Tween(radius)
            .to({r:200}, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                circle.setAttribute("r", radius.r)
            })
            .start()

    })
});


console.log("bounding box h, w: " + getSize(boundingBox)[0], getSize(boundingBox)[1])

