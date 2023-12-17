//global consts
const invisibleCharacter = "‎";
const plusChar = "＋";
const minusChar = "－";
const multChar = "×";
const divChar = "÷";
const opBindings = {"+":"＋", "-":"－", "*":"×", "/":"÷", "=":"="};
const numTokens = 12;


//global vars
let rowCounter = 0;
let currentFocusBox = undefined;
let curSoln = "";
let curNumBoxes = undefined;


//LOGIC
function checkForValidEquation() {
    let lhs = "";
    let rhs = "";
    let reachedEquals = false;
    $('.row' + String(rowCounter)).children().each(function() {
        if ($(this).text() === "=") {
            reachedEquals = true;
        } else {
            if (reachedEquals) {
                rhs += $(this).text();
            } else {
                lhs += $(this).text();
            }
        }
    });
    return eval(lhs) === eval(rhs);
}
function checkForWin() {
    let input = "";
    $('.row' + String(rowCounter)).children().each(function() {
        input += ($(this).text() === "") ? " " : $(this).text();
    });
    return input === curSoln;
} 
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
function guess() {
    console.log("checking")
    if (!checkForValidEquation()) {
        console.log("invalid eq");
        $('#shakeDiv').addClass('shake-animation');
        setTimeout(function() {
            $('#shakeDiv').removeClass('shake-animation');
        }, 500);
        return;
    }
    console.log("valid eq, checking for win");
    if (checkForWin()) {
        alert("win");
    }
}

//HTML COMPONENTS
function createBoxes(numBoxes) {
    console.log("creating " + numBoxes + " boxes")
    let newRow = $(".full-screen").append(`<div class="columns is-mobile is-centered new-cols shakeDiv">`);
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
function setupBoxes() {
    for (let i = 0; i < curSoln.length; i++) {
        if (curSoln[i] === "=") {
            $("#0-" + String(i)).html(opBindings["="]);
        }
    }
}

//CLICK LISTENERS
function addToDisplay(value) {
    //insert value
    if (currentFocusBox != undefined && document.getElementById(currentFocusBox).innerHTML != "="){
        document.getElementById(currentFocusBox).innerHTML = value;
    }
    
    //move to next digit box
    let col = currentFocusBox.charAt(currentFocusBox.length - 1);
    if (col < curNumBoxes) {
        for (let i = 0; i < rowCounter; i++) {
            for (let j = 0; j < 7; j++) {
                $("#" + i + "-" + j).css('background-color', 'transparent');
            }      
        }
        currentFocusBox = currentFocusBox.charAt(0) + "-" + String(Number(col) + 1);
        console.log(currentFocusBox);
        $("#" + currentFocusBox).css('background-color', 'rgba(255, 165, 0, 0.25)');
    }
}
function addToDisplayOp(value) {
    let col = currentFocusBox.charAt(currentFocusBox.length - 1);
    if (col < curNumBoxes) {
        for (let i = 0; i < rowCounter; i++) {
            for (let j = 0; j < 7; j++) {
                $("#" + i + "-" + j).css('background-color', 'transparent');
            }      
        }
        currentFocusBox = currentFocusBox.charAt(0) + "-" + String(Number(col) + 1);
        console.log(currentFocusBox);
        $("#" + currentFocusBox).css('background-color', 'rgba(255, 165, 0, 0.25)');
    }
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
    //uhm for some reason I couldn't get it to click on elems other than document...
    let id = event.target.id;
    let className = event.target.className;

    // console.log("Tapped element ID:", id);
    // console.log("Tapped element Class:", className);
    
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
    curNumBoxes = 7;
    createBoxes(7);
    curSoln = generateSoln(7);
    console.log(curSoln);

    setupBoxes();
});


