//global consts
const invisibleCharacter = "‎";
const plusChar = "＋";
const minusChar = "－";
const multChar = "×";
const divChar = "÷";
const opBindings = {"＋":1, "－":2, "×":3, "÷":4, "=":5};

//global vars
let rowCounter = 0;
let currentFocusBox = undefined;
let curSoln = "";


//LOGIC
function getRandomInt(min, max) {
    min = Math.ceil(min);   // Round up the minimum value
    max = Math.floor(max);  // Round down the maximum value
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateSoln(totalLength) {
    const operators = ['+', '-', '*', '/'];
    let equation = '';
    let result = 0;
  
    // Determine the maximum length for the equation (leaving space for the result)
    const maxEquationLength = totalLength - 3;
  
    // Generate random numbers and operators to form a valid equation
    while (equation.length < maxEquationLength) {
      if (equation.length > 0 && Math.random() < 0.5) {
        // Insert an operator randomly after the first character
        equation += operators[Math.floor(Math.random() * operators.length)];
      }
  
      // Generate random numbers for each position
      equation += Math.floor(Math.random() * 9) + 1;
    }
  
    // Evaluate the generated equation to get the result
    try {
      result = eval(equation); // Evaluate the equation string
    } catch (error) {
      // If an error occurs during evaluation, generate a new equation
      return generateSoln(totalLength);
    }
  
    // Convert the result to a string
    const resultString = '=' + result.toString();
  
    // Calculate the remaining space for padding
    const paddingLength = totalLength - equation.length - resultString.length;
  
    // Check if the result is a finite number and an integer
    if (isFinite(result) && Number.isInteger(result) && paddingLength >= 0) {
      // Add padding to the equation to reach the desired length
      equation += ' '.repeat(paddingLength);
      return equation + resultString;
    } else {
      // If the result is not an integer or not finite, generate a new equation
      return generateSoln(totalLength);
    }
}
function checkForWin() {

}
function guess() {
    
}

//HTML COMPONENTS
function createBoxes(numBoxes) {
    console.log("creating " + numBoxes + " boxes")
    let newRow = $(".full-screen").append(`<div class="columns is-mobile is-centered new-cols">`);
    for (let i = 0; i < numBoxes; i++) {
        $(".new-cols").append(`
            <div class="column digit-box" id="${rowCounter}-${i}" style="height:${window.innerHeight/9}">${invisibleCharacter}
            </div>
        `);
    }
    $(".new-cols").addClass(`row${rowCounter}`);
    rowCounter++;
    $(".new-cols").removeClass("new-cols");
}

//CLICK LISTENERS
//uhm for some reason I couldn't get it to click on elems other than document...
function addToDisplay(value) {
    if (currentFocusBox != undefined){
        document.getElementById(currentFocusBox).innerHTML = value;
    }
}
function addToDisplayOp(value) {
    switch (value) {
        case 1:
            document.getElementById(currentFocusBox).innerHTML = plusChar;
            break;
        case 2:
            document.getElementById(currentFocusBox).innerHTML = minusChar;
            break;
        case 3:
            document.getElementById(currentFocusBox).innerHTML = multChar;
            break;
        case 4:
            document.getElementById(currentFocusBox).innerHTML = divChar;
            break;    
    }
}
function clearDisplay() {
    if (currentFocusBox != undefined){
        document.getElementById(currentFocusBox).innerHTML = "";
    }
}
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
        $("#" + id).css('background-color', 'rgba(255, 165, 0, 0.25)');
    }
});


//MAIN
$(document).ready(() => {
    createBoxes(7);
    curSoln = generateSoln(7);
    console.log(curSoln);
});


