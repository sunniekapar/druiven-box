import { logicFunctions } from './questions.js';

const accentColor:string = "#0059b8"
const dominantColor:string = "#141414"
const contrastColor:string = "#242424"
const lightColor:string = "#f5f5f5"
const incorrectColor:string = "#D62828"

const output = document.querySelector(".inputs__output") as HTMLDivElement 
const inputSwitches = Array.from(document.querySelectorAll<HTMLInputElement>(".checkbox")) 
const hintButton = document.querySelector(".hint__link") as HTMLButtonElement 
const modal = document.querySelector(".modal-wrapper") as HTMLDivElement 
const modalCloseButton = document.querySelector(".modal__close") as HTMLButtonElement 
const multipleChoiceOptions = Array.from(document.querySelectorAll<HTMLInputElement>(".multiple-choice"))  
const submitButton = document.querySelector(".submit-button") as HTMLButtonElement 
const selectionImages = Array.from(document.querySelectorAll<HTMLImageElement>(".selection-images")) 

const totalNumberOfQuestions:number = 4 
const urlParams = new URLSearchParams(window.location.search)
let difficulty:number = Number(urlParams.get("difficulty")) /////////////////////// if the value gets deleted set it to zero (todo)
let numberOfInputs:number = 4
let selectedChoice:number|null = null;
let answer:number = Math.floor(Math.random() * 4) 
let randomQuestion:number = Math.floor(Math.random() * logicFunctions.length) 
let inputSwitchesValue: number[] = [0,0,0,0] 

window.onload = () => {
    generateImages()
    for (let i = 0; i < numberOfInputs; i++) {
        changeInputSwitchValue(i)      
    }
}

inputSwitches.forEach(inputSwitch => {
    inputSwitch.addEventListener('click', () => { 
        inputSwitch.value = String(Math.abs(Number(inputSwitch.value) - 1)) 
        changeInputSwitchValue(Number(inputSwitch.name))
    })
})

hintButton.addEventListener('click', () => {
    isModalVisible(true)
})

modalCloseButton.addEventListener('click', () => {
    isModalVisible(false)
})

multipleChoiceOptions.forEach(selection => {
    selection.addEventListener('click', () => {
        selectedChoice = Number(selection?.value)
    })
})
a
submitButton?.addEventListener('click', () => {
    if(selectedChoice == null) return
    if(selectedChoice == answer) {
        location.reload();
        return
    }
    let wrongSelection = document.getElementById("option" + multipleChoiceOptions.at(selectedChoice)!.id)
    wrongSelection?.classList.add("wrong-answer")
    wrongSelection!.style.background = incorrectColor
})

function generateImages() {
    for(let i = 0; i < 4; i++) {  
        let n = Math.floor(Math.random() * totalNumberOfQuestions)
        while(n != answer) {
            n = Math.floor(Math.random() * totalNumberOfQuestions)
        }
        selectionImages.at(i)!.src = "https://picsum.photos/200" //+ n + difficulty//
    }
    selectionImages.at(answer)!.src = "https://picsum.photos/100" 
}

function checkIfAnswerIsRight() {
    changeOutputValue(logicFunctions[1](inputSwitchesValue, difficulty))
}

function changeOutputValue(inputsMatchesExpression:number | boolean) {
    if(inputsMatchesExpression) { 
        output.style.background = accentColor
        output.innerHTML = "1"
        return
    } 
    output.style.background = contrastColor
    output.innerHTML = "0"
}

function changeInputSwitchValue(inputName:number) {
    inputSwitchesValue[inputName] = Number(inputSwitches.at(inputName)?.value)
    checkIfAnswerIsRight()
}

function isModalVisible(state:boolean) {
    return(state ? modal.classList.remove("hidden") : modal.classList.add("hidden"))
}

function generateTruthTable(question: number, difficulty: number, inputs: number) {
	let truthTable: Boolean[] | Number[] = new Array();
	for (let i = 0; i<2**inputs; i++) {
		truthTable[i] = logicFunctions[question]([(i/(2**(inputs-1)))%2,(i/(2**(inputs-2)))%2,(i/(2**(inputs-3)))%2,(i/(2**(inputs-4)))%2], difficulty)
	}
    return(truthTable)
}

/*
    Nested for loop for creating the table stuff

    <tr></tr>
    for (i <= inputs) {
        <td> A </td>
        ...
        <td> Output </td>
    }

    for (i < how many rows (2**inputs)) {
        for (j <= inputs) {
            <td> A value </td>

            .. next loop: <td> B value </td>

            ... last loop: <td> output </td>
        }
        <tr></tr>
    }
*/