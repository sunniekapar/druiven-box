export const logicFunctions = [logic0, logic1, logic2, logic3, logic4, logic5]

function logic0(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return(inputs[0] || inputs[1]) // A+B
		case 1:
		return((inputs[0] && !inputs[1]) || (!inputs[0] && inputs[2])) // (A*!B) + (!A*C)
		case 2:
		return((inputs[1] && (inputs[0] || inputs[2])) || (!inputs[1] && !inputs[2])) // B*(A+C) + (!B*!C)
		case 3: 
		return((!inputs[0] && (!inputs[3] || (inputs[1] && !inputs[2]))) || (inputs[0] && !inputs[1] && !inputs[2] && inputs[3])) // !A*(!D + (B*!C)) + A*!B*!C*D
	}
	return false
}

function logic1(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return(inputs[0] && inputs[1]) // A*B
		case 1:
		return(inputs[2] && (!inputs[0] || inputs[1])) // C*(!A+B)
		case 2:
		return((inputs[0] && (!inputs[1] || inputs[2])) || (!inputs[1] && inputs[2])) // A*(!B+C) + (!B*C)
		case 3:
		return(inputs[3] || (inputs[0] && inputs[1] && inputs[2]) || (!inputs[0] && !inputs[1] && !inputs[2])) // D + (A*B*C) + (!A*!B*!C)
	}
	return false
}

function logic2(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return(!(inputs[0] && inputs[1])) // !(A*B)
		case 1:
		return((inputs[0] && (!inputs[2] || !inputs[1]))) // A*(!C + !B)
		case 2:
		return((inputs[1] && (!inputs[2] || inputs[1])) || (inputs[0] && !inputs[2])) // B*(!C + A) + (A*!C)
		case 3:
		return((inputs[2] && (!inputs[3] || (!inputs[0] && inputs[1]))) || (inputs[0] && inputs[1] && !inputs[2])) // C*(!D + (!A*B)) + (A*B*!C)
	}
	return false
}

function logic3(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return((inputs[0] ^ inputs[1])) // A^B
		case 1:
		return((inputs[0] && !inputs[2]) || (!inputs[0]) && inputs[2]) // (A*!C) + (!A*C)
		case 2:
		return(!inputs[2] || (!inputs[0] && inputs[1]) || (inputs[0] && !inputs[1])) // !C + (!A*B) + (A*!B)
		case 3:
		return((!inputs[1] && inputs[3]) || (inputs[1] && !inputs[3]) || (inputs[0] && inputs[1] || (!inputs[0] && !inputs[1]))) // (!B*D) + A*C + !A*!C + (B*!D)
	}
	return false
}

function logic4(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return(!(inputs[0] || inputs[1])) // !(A+B)
		case 1:
		return(!inputs[2] || (inputs[0] && !inputs[1])) // !C + (A*!B)
		case 2:
		return((!inputs[1] && (!inputs[0] || !inputs[2])) || (inputs[0] && inputs[1] && inputs[2])) // !B*(!A + !C) + A*B*C
		case 3:
		return((inputs[2] && (!inputs[0] || (inputs[1] && inputs[3]))) || (inputs[0] && !inputs[2])) // C*(!A + (B*D)) + (A*!C)
	}
	return false
}

function logic5(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return(!(inputs[0] ^ inputs[1])) // !(A^B)
		case 1:
		return(inputs[2] || (!inputs[0] && inputs[1])) // C + (!A*B)
		case 2:
		return(!inputs[1] || (!inputs[0] && !(inputs[2])) || (inputs[0] && inputs[2])) // !B + (!A*!C) + (A*C)
		case 3:
		return(!inputs[3] || (!inputs[1] && (inputs[0] && !inputs[1]) || (!inputs[0] && inputs[1]))) // !D + !B*(A*!B + !A*B)
	}
	return false
}

/* 

function logic6(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return(inputs[0] || inputs[1]) // A+B
		case 1:
		return(inputs[0])
		case 2:
		  
		case 3:
	}
	return false
}
/* More questions to do in the future
function logic7(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return false
		case 1:
		return false
		case 2:
		 
		case 3:
	}
	return false
}

function logic8(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return false
		case 1:
		return false
		case 2:
		  
		case 3:
	}
	return false
}

function logic9(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return false
		case 1:
		return false
		case 2:
		  
		case 3:
	}
	return false
}

function logic10(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return false
		case 1:
		return false
		case 2:
		  
		case 3:
	}
	return false
}

function logic11(inputs: number[], difficulty: number) { 
	switch (difficulty) {
		case 0:
		return false
		case 1:
		return false
		case 2:
		  	
		case 3:
	}
	return false
}
*/
