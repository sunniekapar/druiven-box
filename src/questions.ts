console.log("Testdsfgsds")
class questions {
    constructor(imgSrc:string) {

    }
}

const question1 = new questions("placeholder");

export const logicFunctions = [logic1, logic2]

function logic1(inputs: number[]) {
    return(andGate(orGate(inputs[0], inputs[1]), inputs[3]));
}

function logic2(inputs: number[]) {
return(orGate(xorGate(inputs[1], inputs[2]), inputs[0]));
}


function orGate (inputA: number, inputB: number) {
	if (inputA+inputB != 0) return(1);
	return(0);
}

function andGate (inputA: number, inputB: number) {
	if (inputA+inputB === 2) return(1);
	return(0);
}

function norGate (inputA: number, inputB: number) {
	if (inputA+inputB === 0) return(1);
	return(0);
}

function notGate (inputA: number) {
	return((inputA-1)^2)
}

function nandGate (inputA: number, inputB: number) {
	if (inputA+inputB != 2) return(1);
	return(0);
}

function xorGate (inputA: number, inputB: number) {
	if (inputA+inputB === 1) return(1);
	return(0);
}

function xnorGate (inputA: number, inputB: number) {
	if (inputA+inputB != 1) return(1);
	return(0);
}
