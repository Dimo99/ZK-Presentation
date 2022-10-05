pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Hash() {
    signal input sk;
    signal output hash;

    component hasher = Poseidon(1);

    hasher.inputs[0] <== sk;

    hash <== hasher.out;
}

component main = Hash();