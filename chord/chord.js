var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
var addOns = ['', '#', 'b'];
var quality = ['M', 'm', "\u00f8", 'o'];
var badChords = [''];

function randInList(array) {
    var output = array;
    output = output[(Math.floor(Math.random() * output.length))];
    return output;
}

/**
 * 
 * @param {*} array input array
 * @param {*} weight array w/ percentage weight Ex:[.2, .6, .2]
 */
function weightedRand(array, weight) {
    var i, weights, additiveWeights = [], table=[], output;
    table = array;
    weights = weight;
    if (weights.length != table.length) {
        throw new Error("ArrayMismatchError");
    }
    for (i in weights) {  //generate [.2, .8, 1.0]
        if (i < 1) {
            additiveWeights[0] = weights[0];
            cur = weights[0];
        } else {
            additiveWeights[i] = weights[i] + cur;
            cur += weights[i];
        }
    }

    var r = Math.random();
    for (i in table) {
        if (i < 1) {
            if (r <= additiveWeights[0]) {
                output = table[i];
            }
        } else {
            if (r <= additiveWeights[i] && r >= additiveWeights[i - 1]) {
                output = table[i];
            }
        }
    }

    if (output == undefined) {
        console.log("You done goofed. 0.1% chance of this happening. That's good enough.");
        while (i < 100) {
            $(".container").fadeIn(10).fadeOut(10);
        }
    }

    console.log(output);
    return output;
  }

function generateChord() {
    var curDisplay = randInList(notes) + weightedRand(addOns, [0.5, 0.25, 0.25]) + weightedRand(quality, [0.33, 0.33, (1/6), (1/6)]) + '7';
    for (var i in badChords) {
        if (curDisplay == badChords[i]) {
            return generateChord();
        }
    }
    return curDisplay;
}



$(document).ready(function(){
    $("#generate").click(function() {
        $(".chord-display").html(generateChord());
    });
});