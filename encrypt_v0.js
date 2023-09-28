const numRotorsUsed = 3;

const reflectorWiring = [
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
export let rotorIndexMap = [];
function initRotorIndexMap (startingPositions, rotorIndexMap){
    rotorIndexMap.initNull(rotorWiring.length);
    for (var Nrotor = 0; Nrotor < rotorIndexMap.length; ++Nrotor){
        rotorIndexMap[Nrotor] = mapLetterToIndex(rotorWiring[Nrotor]);
        rotorIndexMap[Nrotor] = rotorIndexMap[Nrotor].rotateLeft(startingPositions[Nrotor]);
    }
}

export let reflectorIndexMap = []; reflectorIndexMap.initNull(reflectorWiring.length);
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
                 rotorsThisTrial[Nrotor - 1] = rotorsThisTrial[Nrotor - 1].rotateLeft(1);
             }
             rotorsThisTrial[Nrotor] = rotorsThisTrial[Nrotor].rotateLeft(1);
             break;
        }
    }
    rotorsThisTrial[0] = rotorsThisTrial[0].rotateLeft(1);
}

Number.prototype.getIndexOut = function(plugboardThisTrial, rotorsThisTrial, reflectorThisTrial){    
    let indexOut = this; // *** console.log("%cIndex In", "font-weight: bolder; color: #00A", indexOut);
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

String.prototype.ENIGMA = function(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorIndex){
    updateRotorMap(rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn);
    let reflectorThisTrial = reflectorIndexMap[reflectorIndex];

    let strOut = ``;
    for (let Nchar = 0; Nchar < this.length; ++Nchar){            
        let indexIn = letterToIndex[this[Nchar]];
        if (indexIn != undefined){ //if not special character
            rotateRotors(rotorsThisTrial, shiftNextOn);
            let indexOut = indexIn.getIndexOut(plugboardThisTrial, rotorsThisTrial, reflectorThisTrial);
            strOut += indexToLetter[indexOut];
        } else {
            strOut += this[Nchar];
        }
        
    }
    return strOut;
}


let rotorOrder         = [0,3,2];
let startingPositions  = [0,0,0];
let rotorsThisTrial    = []; rotorsThisTrial.initNull(rotorOrder.length);
let     shiftNextOn    = []; shiftNextOn.initNull(rotorOrder.length);
let reflectorThisTrial = reflectorIndexMap[3];
let reflectorIndex     = 2
let plugboardThisTrial = [1,0,3,2,5,4,7,6,9,8,11,10,13,12,15,14,17,16,19,18, 20,21,22,23,24,25];

let message = "SHE'S A PHOENIX\nDESPERATION AND HOPE AMIX\nFIGHTING AS HER TIME TICKS\nTILL HER FEATHERS BURN LIKE CANDLE WICKS\nSHE'S A PHOENIX\nTHERE'S SO MUCH SHE TRIES TO FIX\nHOPING THE PAIN NO LONGER STICKS\nMAYBE A WAY OUT SHE CAN PICK\n\n\nSHE'S WRAPPED IN SCARLET AND GOLD\nSHE'S SCORCHED WITH PAIN UNTOLD\nSHE'S REDUCED TO WHITE AND GRAY\nBUT SHE WILL LIVE ANOTHER DAY\nCAUSE\nSHE'S DONE A THOUSAND TESTS AND FAILED A THOUSAND TIMES\nSHE'S GOT A THOUSAND WRONGS AND ASKED A THOUSAND WHYS\nSHE'S FOUGHT A THOUSAND BATTLES AND PAID A THOUSAND LIVES\nAND WHEN SHE DIES, SHE FEELS ALIVE";
console.log("%cMessage:\n", "font-weight: bold; color: #A00", message + "\n\n");

let encoded = message.ENIGMA(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorIndex);
console.log("%cEncoded:\n", "font-weight: bold; color: #A00", encoded + "\n\n");

let decoded = encoded.ENIGMA(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorIndex);
console.log("%cDecoded:\n", "font-weight: bold; color: #A00", decoded + "\n\n");
