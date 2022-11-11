import {champLookup, fullData, abilityToChamp, abilityToAbilityBinding} from "./ddragondata/ddragondata.js";

const input = document.querySelector(".ability-input");
const tableBody = document.querySelector(".table-body");
const allAbilities = Object.keys(abilityToChamp);

var curGuessNum = 1;
var answer = "";
var isStart = false;
var correctChamp = "";
var correctCC = "";
var correctLvlUp = "";

var numCorrect = 0;

function toAlias(){

}

function updateTable(){
    const newRow = document.createElement("tr");
    const newRowHeader = document.createElement("th");
    const newChampName = document.createElement("td");
    const newAbilityName = document.createElement("td");
    const newCCTypes = document.createElement("td");
    const newLvlUp = document.createElement("td");

    // add ability
    const abilityToAdd = document.createTextNode(input.value);
    newAbilityName.appendChild(abilityToAdd);

    // add champ name
    const champName = abilityToChamp[input.value];
    const champToAdd = document.createTextNode(champName);
    newChampName.appendChild(champToAdd);

    // add cc types
    var ccTypesToAdd = "";
    var rawCCTypes = champLookup(champName)[abilityToAbilityBinding[input.value]]["cc"]
    for (var index in rawCCTypes){
        ccTypesToAdd = ccTypesToAdd + " " + rawCCTypes[index];
    }
    ccTypesToAdd = document.createTextNode(ccTypesToAdd);
    newCCTypes.appendChild(ccTypesToAdd);

    // add lvl up stats
    var lvlUpToAdd = "";
    var rawLvlUp = champLookup(champName)[abilityToAbilityBinding[input.value]]["lvlUp"];
    for (var index in rawLvlUp){
        lvlUpToAdd = lvlUpToAdd + " " + rawLvlUp[index];
    }
    lvlUpToAdd = document.createTextNode(lvlUpToAdd);
    newLvlUp.appendChild(lvlUpToAdd);

    // correct/incorrect class data
    if (input.value == answer) {
        newAbilityName.classList.add("bg-success");
        numCorrect++;
    } else {
        newAbilityName.classList.add("bg-danger");
    }

    if (abilityToChamp[input.value] == correctChamp) {
        newChampName.classList.add("bg-success");
        numCorrect++;
    } else {
        newChampName.classList.add("bg-danger");
    }

    var numCCCorrect = 0;
    for (var i in rawCCTypes) {
        if (correctCC.includes(rawCCTypes[i])){
            console.log(rawCCTypes[i] + "is in correctCCTypes");
            numCCCorrect++;
        }
    }
    if (numCCCorrect == correctCC.length) {
        console.log("cc all correct", numCCCorrect, correctCC.length)
        newCCTypes.classList.add("bg-success");
        numCorrect++;
        console.log("cc not all correct")
    } else {
        newCCTypes.classList.add("bg-danger");
    }

    var numlvlUpCorrect = 0;
    for (var i in rawLvlUp) {
        if (correctLvlUp.includes(rawLvlUp[i])){
            console.log(rawLvlUp[i] + "is in correctLvlUp");
            numlvlUpCorrect++;
        }
    }
    if (numlvlUpCorrect == correctLvlUp.length) {
        newLvlUp.classList.add("bg-success");
        numCorrect++;
    } else {
        newLvlUp.classList.add("bg-danger");
    }

    // append HTML
    newRowHeader.appendChild(document.createTextNode(curGuessNum.toString()));
    tableBody.appendChild(newRow);
    newRow.appendChild(newRowHeader);
    newRow.appendChild(newAbilityName);
    newRow.appendChild(newChampName);
    newRow.appendChild(newCCTypes);
    newRow.appendChild(newLvlUp);
}

function startGame() {
    answer = allAbilities[Math.floor(Math.random()*allAbilities.length)];
    isStart = true;
    correctChamp = abilityToChamp[answer];
    correctCC = champLookup(correctChamp)[abilityToAbilityBinding[answer]]["cc"]
    correctLvlUp = champLookup(correctChamp)[abilityToAbilityBinding[answer]]["lvlUp"];
    console.log(correctCC, correctLvlUp);
}

function checkforWin(){
    if (numCorrect == 4) {
        alert("you win after " + curGuessNum + " !");
    }
}

document.querySelector('#search-button').addEventListener("click", function(){
    if (!isStart){
        startGame();
        console.log("the answer is " + answer);
    }
    updateTable();
    checkforWin();
    curGuessNum++;
    numCorrect = 0;
});


