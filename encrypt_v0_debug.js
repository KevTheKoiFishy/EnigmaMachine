const numRotorsUsed = 3;


const reflectorWiring = [
    // "LEYJVCNIXWPBQMDRTAKZGFUHOS",
    // "FSOKANUERHMBTIYCWLQPZXVGJD",
    "EJMZALYXVBWFCRQUONTSPIKHGD",
    "YRUHQSLDPXNGOKMIEBFZCWVJAT",
    "FVPJIAOYEDRZXWGCTKUQSBNMHL",
    "ENKQAUYWJICOPBLMDXZVFTHRGS",
    "RDOBJNTKVEHMLFCWZAXGYIPSUQ",
 	"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "BADCFEHGJILKNMPORQTSVUXWZY"
];
const rotorWiring = [
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "BDFHJLCPRTXVZNYEIWGAKMUSQO",
    "ESOVPZJAYQUIRHXLNFTGKDCMWB",
    "VZBRGITYUPSDNHLXAWMJQOFECK",
    // "JPGVOUMFYQBENHZRDKASXLICTW",
    // "NZJHGRCXMYSWBOUFAIVLPEKQDT",
    // "FKQHTLXOCBJSPDZRAMEWNIUYGV",
];
const shiftNextWhenOn_Letter = "RFWKA".split("");

const indexToLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let letterToIndex = {};
for (let Nletter = 0; Nletter < 26; ++Nletter){
    letterToIndex[indexToLetter[Nletter]] = Nletter;
}

Array.prototype.initNull = function(len){
    this.length = 0;
    for (let i = 0; i < len; ++i)
        this.push(null);
}

Array.prototype.rotateLeft = function(n){
    n = n % this.length;
    let removedElements = this.splice(0, n);
    return this.concat(removedElements);
}

let shiftNextWhenOn_Index = []; shiftNextWhenOn_Index.initNull(numRotorsUsed);
for (let Nrotor = 0; Nrotor < rotorWiring.length; ++Nrotor) {
    shiftNextWhenOn_Index[Nrotor] = letterToIndex[shiftNextWhenOn_Letter[Nrotor]];
}

//Use numbers rather than letter indexing
//If inputting the letter C[2] and outputting the letter B[1], the map should have value 1 in the second index.
//output letter's index shud be in index corresponding to input letter
function mapLetterToIndex (wiringString){
    let map = []; map.initNull(26);
    for (let Nletter = 0; Nletter < 26; ++Nletter){
        map[Nletter] = letterToIndex[wiringString[Nletter]];
    }
    return map;
}

//call each time we try new starting position
let rotorIndexMap = [];
function initRotorIndexMap (startingPositions, rotorIndexMap){
    rotorIndexMap.initNull(rotorWiring.length);
    for (var Nrotor = 0; Nrotor < rotorIndexMap.length; ++Nrotor){
        rotorIndexMap[Nrotor] = mapLetterToIndex(rotorWiring[Nrotor]);
        rotorIndexMap[Nrotor] = rotorIndexMap[Nrotor].rotateLeft(startingPositions[Nrotor]);
    }
}

let reflectorIndexMap = []; reflectorIndexMap.initNull(reflectorWiring.length);
for (var Nreflector = 0; Nreflector < reflectorIndexMap.length; ++Nreflector){
    reflectorIndexMap [Nreflector] = mapLetterToIndex(reflectorWiring[Nreflector]);
}

//call each time we select a new permutation of rotors
function updateRotorMap(rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn){
    initRotorIndexMap(startingPositions, rotorIndexMap);
    for (let Nrotor = 0; Nrotor < rotorOrder.length; ++Nrotor){
        rotorsThisTrial[Nrotor] = rotorIndexMap[rotorOrder[Nrotor]];
        shiftNextOn[Nrotor] = shiftNextWhenOn_Index[rotorOrder[Nrotor]];
    }
}
function getReflectorUsed(Nreflector){
    return reflectorIndexMap[Nreflector];
}

//call BEFORE each new letter
function rotateRotors(rotorsThisTrial, shiftNextOn) {        
    for (var Nrotor = 1; Nrotor < numRotorsUsed; ++Nrotor){
        if (rotorsThisTrial[Nrotor - 1][0] == shiftNextOn[Nrotor - 1]){
             if (Nrotor > 1){
                 // *** console.log("%cDbl Step", "font-weight: bolder; color: #0A0", Nrotor - 1);
                 rotorsThisTrial[Nrotor - 1] = rotorsThisTrial[Nrotor - 1].rotateLeft(1);
             }
             // *** console.log("%cStep", "font-weight: bolder; color: #0A0", Nrotor);
             rotorsThisTrial[Nrotor] = rotorsThisTrial[Nrotor].rotateLeft(1);
             break;
        }
        //double stepping - 
        //if this rotor is the third and subsequent position
        //AND is notched by the previous rotor (prev. rotor just got shifted)
        //then also step the previous rotor.
        // the break; is there because only one rotor can have the notch at a time.
    }
    rotorsThisTrial[0] = rotorsThisTrial[0].rotateLeft(1);
    // *** console.log("%cStep", "font-weight: bolder; color: #0A0", 0);

    // *** console.log(rotorsThisTrial[0], rotorsThisTrial[1], rotorsThisTrial[2]);
}

function getIndexOut (indexIn, plugboardThisTrial, rotorsThisTrial, shiftNextOn, reflectorThisTrial){    
    let indexOut = indexIn; // *** console.log("%cIndex In", "font-weight: bolder; color: #00A", indexOut);
    //plugboard once
    indexOut = plugboardThisTrial[indexOut]; // *** console.log("%cPlug", "font-weight: bolder; color: #00A", indexOut);
    //forward rotor
    for (var Nrotor = 0; Nrotor < numRotorsUsed; ++Nrotor){
        indexOut = rotorsThisTrial[Nrotor][indexOut]; // *** console.log("%cRotor " + Nrotor, "font-weight: bolder; color: #00A", indexOut);
    }
    //reflect
    indexOut = reflectorThisTrial[indexOut]; // *** console.log("%cReflect", "font-weight: bolder; color: #00A", indexOut);
    //inverse
    for (var Nrotor = numRotorsUsed - 1; Nrotor >= 0; --Nrotor){
        indexOut = rotorsThisTrial[Nrotor].indexOf(indexOut); // *** console.log("%cRotor^-1 " + Nrotor, "font-weight: bolder; color: #00A", indexOut);
    }
    //plugboard again
    indexOut = plugboardThisTrial[indexOut]; // *** console.log("%cPlug", "font-weight: bolder; color: #00A", indexOut);
    return indexOut;
}

// TESTING - ALL PASS! <3
    let rotorOrder        = [0,3,2];
    let startingPositions = [0,0,0];
    let rotorsThisTrial   = []; rotorsThisTrial.initNull(rotorOrder.length);
    let     shiftNextOn   = []; shiftNextOn.initNull(rotorOrder.length);
        updateRotorMap(rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn);
    let reflectorThisTrial = reflectorIndexMap[3];
    let plugboardThisTrial = [1,0,3,2,5,4,7,6,9,8,11,10,13,12,15,14,17,16,19,18, 20,21,22,23,24,25];
// ENCODING SINGLE LETTER - PASS
    // let encodedLetter = getIndexOut(0, plugboardThisTrial, rotorsThisTrial, shiftNextOn, reflectorThisTrial);
    // let decodedLetter = getIndexOut(encodedLetter, plugboardThisTrial, rotorsThisTrial, shiftNextOn, reflectorThisTrial);
    // console.log(encodedLetter, decodedLetter);
// ROTATE ROTORS - PASS
    // shiftNextOn = [rotorsThisTrial[0][1], rotorsThisTrial[1][0], rotorsThisTrial[2][1]];
    // console.log(shiftNextOn);
    // console.log(rotorsThisTrial[0], rotorsThisTrial[1], rotorsThisTrial[2]);
    // for (var test = 0; test < 26*2+10; ++test){
    //     rotateRotors(rotorsThisTrial, shiftNextOn);
    // }
// FULL STRING ENCODING - 3/3 PASS
    // BRUHHHHHHHHHHHH i figured it out!!!! if thisLetter is an A, indexIn will be 0, so the thing will be skipped. This is why none of the As got decoded. Dammit. I thought it was the rotor's problem SMHHHH.

    // ENCODE THEN DECODE SINGLE LETTERS - PASS
    // let testString = `YOLO IS MY IDOL`;
    // let encoded = ``;
    // let decoded = ``;
    // for (Nchar = 0; Nchar < testString.length; ++Nchar){
    //     rotateRotors(rotorsThisTrial, shiftNextOn);
        
    //     let indexIn = letterToIndex[testString[Nchar]];
    //     if (indexIn){ //if not special character
    //         let encodedIndex = getIndexOut(indexIn, plugboardThisTrial, rotorsThisTrial, shiftNextOn, reflectorThisTrial);
    //         let decodedIndex = getIndexOut(encodedIndex, plugboardThisTrial, rotorsThisTrial, shiftNextOn, reflectorThisTrial);
    //         console.log("%cInitial:", "font-weight: bold; color: #A00", indexToLetter[indexIn]);
    //         console.log("%cEncoded:", "font-weight: bold; color: #A00", indexToLetter[encodedIndex]);
    //         console.log("%cDecoded:", "font-weight: bold; color: #A00", indexToLetter[decodedIndex]);
    //         encoded += indexToLetter[encodedIndex];
    //         decoded += indexToLetter[decodedIndex];
    //     } else {
    //         encoded += testString[Nchar];
    //         decoded += testString[Nchar];
    //     }
        
    // }
    // console.log("%c" + decoded, "color: #129");

    // ENCODE WHOLE STRING THEN DECODE - PASS
    // let testString = 'YOLO IS MY IDOL';
    // let encoded = '';
    // let decoded = '';

    // updateRotorMap(rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn);
    // for (Nchar = 0; Nchar < testString.length; ++Nchar){
    //     rotateRotors(rotorsThisTrial, shiftNextOn);
        
    //     let indexIn = letterToIndex[testString[Nchar]];
    // :{P if (indexIn != undefined){ //if not special character
    //         let encodedIndex = getIndexOut(indexIn, plugboardThisTrial, rotorsThisTrial, shiftNextOn, reflectorThisTrial);
    //         // *** console.log("%c" +  indexToLetter[indexIn] + " -> " + indexToLetter[encodedIndex], "font-weight: bold; color: #A00");
    //         encoded += indexToLetter[encodedIndex];
    //     } else {
    //         encoded += testString[Nchar];
    //     }
        
    // }
    // // encoded = encoded.replaceAll('A', 'C'); // for some reason the decoding is not recognizing As
    // // encoded = encoded.replaceAll(/[^a-zA-Z0-9\n ]/g, '');
    // // console.log("%c" + encoded, "color: #921");

    // updateRotorMap(rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn);
    // for (Nchar = 0; Nchar < testString.length; ++Nchar){
    //     rotateRotors(rotorsThisTrial, shiftNextOn);

    //     let thisLetter = encoded.substr(Nchar, 1);
        
    //     let indexIn = letterToIndex[thisLetter];
    // :{P if (indexIn != undefined){ //if not special character
    //         // *** console.log("Index Hit:", thisLetter);
    //         let decodedIndex = getIndexOut(indexIn, plugboardThisTrial, rotorsThisTrial, shiftNextOn, reflectorThisTrial);
    //         // *** console.log("Decoded To:", indexToLetter[decodedIndex]);
    //         decoded += indexToLetter[decodedIndex];
    //     } else {
    //         console.log("%cIndex Miss:", "font-weight: bold; color: #A00", Nchar, thisLetter);
    //         decoded += encoded[Nchar];
    //     }
        
    // }
    // console.log("%c" + decoded, "color: #129");


    // PACKAGE IN FUNCTION - PASS
    String.prototype.ENIGMA = function(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorThisTrial){
        updateRotorMap(rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn);

        let strOut = ``;
        for (let Nchar = 0; Nchar < this.length; ++Nchar){            
            let indexIn = letterToIndex[this[Nchar]];
            if (indexIn != undefined){ //if not special character
                rotateRotors(rotorsThisTrial, shiftNextOn);
                let indexOut = getIndexOut(indexIn, plugboardThisTrial, rotorsThisTrial, shiftNextOn, reflectorThisTrial);
                strOut += indexToLetter[indexOut];
            } else {
                strOut += this[Nchar];
            }
            
        }
        return strOut;
    }

    // let message = "SHE'S A PHOENIX\nDESPERATION AND HOPE AMIX\nFIGHTING AS HER TIME TICKS\nTILL HER FEATHERS BURN LIKE CANDLE WICKS\nSHE'S A PHOENIX\nTHERE'S SO MUCH SHE TRIES TO FIX\nHOPING THE PAIN NO LONGER STICKS\nMAYBE A WAY OUT SHE CAN PICK\n\n\nSHE'S WRAPPED IN SCARLET AND GOLD\nSHE'S SCORCHED WITH PAIN UNTOLD\nSHE'S REDUCED TO WHITE AND GRAY\nBUT SHE WILL LIVE ANOTHER DAY\nCAUSE\nSHE'S DONE A THOUSAND TESTS AND FAILED A THOUSAND TIMES\nSHE'S GOT A THOUSAND WRONGS AND ASKED A THOUSAND WHYS\nSHE'S FOUGHT A THOUSAND BATTLES AND PAID A THOUSAND LIVES\nAND WHEN SHE DIES, SHE FEELS ALIVE"`;
    // console.log("%cMessage:", "font-weight: bold; color: #A00", message);

    // let encoded = message.ENIGMA(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorThisTrial);
    // console.log("%cEncoded:", "font-weight: bold; color: #A00", encoded);

    // let decoded = encoded.ENIGMA(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorThisTrial);
    // console.log("%cDecoded:", "font-weight: bold; color: #A00", decoded);

    // TIMING
    import { performance } from 'perf_hooks';
    let message = `IKNOWWHEREULIVE`;

    let runTimes = [];
    for (let Ntest = 0; Ntest < 5e3; ++Ntest){
        var startTime = performance.now();
        message.ENIGMA(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorThisTrial);
        var endTime = performance.now();

        let runTime = (endTime - startTime) * 1e3;
        runTimes.push(Math.round(runTime * 1e2)/1e2);
        console.log(`${runTime} us`);
    }

    console.log(JSON.stringify(runTimes))