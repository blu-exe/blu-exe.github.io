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
    var finalCoords = getFinalCoords(elem)
    const coords = {x: 0, y: 0} // Start at (0, 0)
    const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({x: finalCoords[0], y: finalCoords[1]}, 1000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
            // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            elem.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`)
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
});


console.log("bounding box h, w: " + getSize(boundingBox)[0], getSize(boundingBox)[1])

