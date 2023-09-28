import { } from './encrypt_v0.js'
let rotorOrder         = [4,0,2];
let startingPositions  = [20,10,6];
let rotorsThisTrial    = [];
let     shiftNextOn    = [];
let reflectorIndex     = 3;
let plugboardThisTrial = [1,0,3,2,5,4,7,6,9,8,11,10,13,12,15,14,17,16,19,18, 20,21,22,23,24,25];
let emptyPlugboard     = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

//Test encoding - works!
    let message = "CHEO I REUM EUN NOEL I YE YO. SARANGHAE!";
    // let message = "I LOVE YA AMY <3"
    console.log("%cMessage: ", "font-weight: bold; color: #A00", message);

    let encoded = message.ENIGMA(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorIndex);
    console.log("%cEncoded: ", "font-weight: bold; color: #A00", encoded);

    let decoded = encoded.ENIGMA(plugboardThisTrial, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorIndex);
    console.log("%cDecoded: ", "font-weight: bold; color: #A00", decoded);

//Test decoding without knowing plugboard
    let plugboardIgnorantDecode = encoded.ENIGMA(emptyPlugboard, rotorOrder, rotorsThisTrial, startingPositions, shiftNextOn, reflectorIndex);
    console.log("%cNoPlugD: ", "font-weight: bold; color: #A00", plugboardIgnorantDecode);

// Next steps:
    // Generate menu (stop conditions) from input-output pair
        // no clue how imma do this but it'll involve some iteration
    // Permute rotor order
        // Pass rotorOrder = [R0 = 0->5] to child,
        // then child pushes [R0, R1 = 0->5 excluding R0] to grandchild
        // grandchild does same to great-grandchild
            //0 -> 5, etc. done using for loop. make exceptions when child's rotor index equals either parents'
        // great-grandchild, etc. sees that rotorOrder.length == numRotorsUsed, starts permuting starting positions
    // Permute starting positions
        // same deal as before, but no exceptions 26^numRotorsUsed rather than rotorOptions Permute numRotorsUsed
        // great grand-child, etc. sees that rotorOrder.length == numRotorsUsed and tests the loop condition
        // if loop conditions pass, add to Array passedLoopConditions[];
        // Testing loop conditions
            // make object loopTestStartingPos{} where each key indexes S_key, which corresponds to a rotorsThisTrial array
            // run loop condition for every letter in the S_0, logging S_0 for those that pass
            // As we advance the rotors, run rotateRotors() on each value in loopTestStartingPos{}
            // !! Optimization idea (test if indexing such a massive array is actually faster than re-running the enigma algorithm)
                // Translate the getIndexOut() fxn, which the loop condition test uses,
                    // into (2*numRotorsUsed + 1)Dim Array
                    // ROTOR_MAP [Rorder0] [Rorder1] [Rorder2] ... [startPos0] [startPos1] [startPos2] ... [wildcardLetterIndex]
                // And translate the rotateRotors() function to advance startingPositions[] rather than rotorsThisTrial[]
                // Then store startingPositions[] in testLoopRotorPos{}
                // Use the startingPositions[] Arrays from testLoopRotorPos as the indexing
                    // for ROTOR_MAP [Rorder0] [Rorder1] [Rorder2] ... [startPos0] [startPos1] [startPos2] ... [wildcardLetterIndex]
                // Then chain the rotor map outputs over the loop and check if we end up with the original value
    // Figure Out Plugboard
        // BFS plug combinations