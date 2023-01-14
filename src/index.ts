const accentColor:string = "#0059b8"
const dominantColor:string = "#141414"
const contrastColor:string = "#242424"
const lightColor:string = "#f5f5f5"
const incorrectColor:string = "#D62828"

const output = document.querySelector(".inputs__output") as HTMLDivElement // output text
const inputSwitches = Array.from(document.querySelectorAll<HTMLInputElement>(".checkbox")) // inputs
const hintButton = document.querySelector(".hint__link") as HTMLButtonElement // hint button
const modal = document.querySelector(".modal-wrapper") as HTMLDivElement // modal that opens up when you press the hint button
const modalCloseButton = document.querySelector(".modal__close") as HTMLButtonElement // the close button for the modal
let randomQuestion = Math.floor(Math.random() * 2) //selecta random question, placeholder right now to test the logic functions 

import { logicFunctions } from './questions.js';

let inputSwitchesValue: number[] = [0,0,0,0] // all zero since all switches are not checked loaded in

changeInputSwitchValue() 



// checks if the answer is right
function verifyOutputValue() {
    changeOutputStyle(logicFunctions[randomQuestion](inputSwitchesValue));
 

    /*
    if(a == 1 && b == 1 && c== 1 && d == 0) { // expression
       changeOutputStyle(1)
       return
    }
    changeOutputStyle(0)
    */
}

// changes the backgruond color of the output
function changeOutputStyle(outputValue:number) {
    if(outputValue == 1) { // if the right answer is selected
        output.style.background = accentColor
        output.innerHTML = "1"
        return
    } 
    output.style.background = contrastColor
    output.innerHTML = "0"
}

// updates the value after a switch is pressed
function changeInputSwitchValue() {
    for(let i = 0; i < inputSwitchesValue.length; i++) {
        inputSwitchesValue[i] = Number(inputSwitches.at(i)?.value)
    }
    verifyOutputValue()
}

// changes the value of each switch
inputSwitches.forEach(inputSwitch => {
    inputSwitch.addEventListener('click', () => { 
        inputSwitch.value = String(Math.abs(Number(inputSwitch.value) - 1)) 
        changeInputSwitchValue()
    })
})

// opens modal when you click the hint link
hintButton.addEventListener('click', () => {
    modalVisibility(true)
})

modalCloseButton.addEventListener('click', () => {
    modalVisibility(false)
})

// changes the visibility of the modal 
function modalVisibility(state:boolean) {
    return(state ? modal.classList.remove("hidden") : modal.classList.add("hidden"))
}


const multipleChoiceOptions = Array.from(document.querySelectorAll<HTMLInputElement>(".multiple-choice")) // each multiple choice 
const submitButton = document.querySelector(".submit-button") as HTMLButtonElement // submit button

let randomAnswerSelection = Math.floor(Math.random() * 4) 

submitButton?.addEventListener('click', () => {
    for(let i = 0; i < multipleChoiceOptions.length; i++) {
        if(multipleChoiceOptions.at(i)?.checked && Number(multipleChoiceOptions.at(i)?.value) == randomAnswerSelection) { // if the answer is selected and right
            location.reload();
            return
        } else if(multipleChoiceOptions.at(i)?.checked) {
            let selectedAnswer = document.getElementById("option" + multipleChoiceOptions.at(i)!.id)
            selectedAnswer?.classList.add("wrong-answer")
            selectedAnswer!.style.background = incorrectColor
            return
        }
    }
})