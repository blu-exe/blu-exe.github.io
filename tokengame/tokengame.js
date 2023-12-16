//global vars
let rowCounter = 0;
let currentFocusBox = undefined;

function addToDisplay(value) {
    if (currentFocusBox != undefined){
        document.getElementById(currentFocusBox).innerHTML = value;
    }
}
  
function clearDisplay() {
    document.getElementById("display").value = "";
}

function createBoxes(numBoxes) {
    console.log("creating " + numBoxes + " boxes")
    let newRow = $(".full-screen").append(`<div class="columns is-mobile is-centered new-cols">`);
    for (let i = 0; i < numBoxes; i++) {
        $(".new-cols").append(`
            <div class="column digit-box" id="${rowCounter}-${i}" style="height:${window.innerHeight/9}">1
            </div>
        `);
    }
    $(".new-cols").addClass(`row${rowCounter}`);
    rowCounter++;
    $(".new-cols").removeClass("new-cols");
}


//uhm for some reason I couldn't get it to click on elems other than document...
$(document).on("click", function(event) {
    //log information about the tapped element
    let id = event.target.id;
    let className = event.target.className;

    console.log("Tapped element ID:", id);
    console.log("Tapped element Class:", className);
    
    //digit boxes
    if(className.includes("digit-box")){
        //remove current highlight
        for (let i = 0; i < rowCounter; i++) {
            for (let j = 0; j < 7; j++) {
                $("#" + i + "-" + j).css('background-color', 'transparent');
            }      
        }
        currentFocusBox = id;
        $("#" + id).css('background-color', 'rgba(0, 0, 0, 0.25)');
    }



});


$(document).ready(() => {
    createBoxes(7);
    createBoxes(7);
    createBoxes(7);
    addToDisplay(6);
});
