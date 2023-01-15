class questions {
    constructor(imgSrc:string) {

    }
}

export const logicFunctions = [logic1, logic2, logic3, logic4]

const question1 = new questions("placeholder");

function logic1(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return false
		case 1:
		return false
		case 2:
		  	return((inputs[0] || inputs[1]) && inputs[3]) 
		case 3:
		
	}
	return false
}

function logic2(inputs: number[]) { // 
	return(!(inputs[1] ^ inputs[2]) || inputs[0])
}

function logic3(inputs:number[]) {
	return(inputs[0] && inputs[1] && inputs[2] && !inputs[3])
}

function logic4(inputs:number[]) {
	return(inputs[0] || inputs[1] && inputs[2] && !inputs[3])
}