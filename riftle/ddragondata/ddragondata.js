import data from "./ver1.json" assert { type: "json" };
console.log("ddragondata loaded");


const fullData = data;

const abilityToChamp = {};
const abilityToAbilityBinding = {};
for (var [champName, champInfo] of Object.entries(fullData)){
    for (var [abilityBinding, abilityInfo] of Object.entries(champInfo)){
        abilityToChamp[abilityInfo["name"]] = champName;
        abilityToAbilityBinding[abilityInfo["name"]] = abilityBinding;
    }
}

function champLookup(champName) {
    return data[champName];
}




export {champLookup, fullData, abilityToChamp, abilityToAbilityBinding};