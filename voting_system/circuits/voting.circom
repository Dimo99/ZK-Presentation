pragma circom 2.0.0;

include "../node_modules/circomlib/curcuits/poseidon.circom";
include "../node_modules/circomlib/circuits/switcher.circom";

template Mkt2VerifierLevel() {
    signal input sibling;
    signal input low;
    signal input selector;
    signal output root;

    component sw = Switcher();
    component hash = Poseidon(2);

    sw.sel <== selector;
    sw.L <== low;
    sw.R <== sibling;

    hash.inputs[0] <== sw.outL;
    hash.inputs[1] <== sw.outR;

    root <== hash.out;
}


template Mkt2Verifier(nLevels) {
    signal input key[nLevels];
    signal input value;
    signal input root;
    signal input siblings[nLevels];

    component levels[nLevels];

    component hashV = Poseidon(1);

    hashV.inputs[0] <== value;

    for (var i=nLevels-1; i>=0; i--) {
        levels[i] = Mkt2VerifierLevel();
        levels[i].sibling <== siblings[i];
        levels[i].selector <== key[i];
        if (i==nLevels-1) {
            levels[i].low <== hashV.out;
        } else {
            levels[i].low <== levels[i+1].root;
        }
    }

    root === levels[0].root;
}