import confetti from 'canvas-confetti';
import { logicFunctions } from './questions.js';

const output = document.querySelector(".inputs__output") as HTMLDivElement 
const inputSwitches = Array.from(document.querySelectorAll<HTMLInputElement>(".checkbox")) 
const hintButton = document.querySelector(".hint__link") as HTMLButtonElement 
const modal = document.querySelector(".modal-wrapper") as HTMLDivElement 
const modalCloseButton = document.querySelector(".modal__close") as HTMLButtonElement 
const multipleChoiceOptions = Array.from(document.querySelectorAll<HTMLInputElement>(".multiple-choice"))  
const submitButton = document.querySelector(".submit-button") as HTMLButtonElement 
const selectionImages = Array.from(document.querySelectorAll<HTMLImageElement>(".selection-images")) 

const totalNumberOfQuestions:number = logicFunctions.length - 1 
const urlParams = new URLSearchParams(window.location.search)
let sound = new Audio("sounds/correctSoundEffect.mp3");
let difficulty:number = 0;
difficulty += (Number(urlParams.get("difficulty")) % 4) /////////////////////// if the value gets deleted set it to zero (todo), or if the value is out of 

let numberOfInputs:number = 4
let selectedChoice:number | null = null;
let answer:number = Math.floor(Math.random() * 4) 
let randomQuestion:number = Math.floor(Math.random() * totalNumberOfQuestions) 
let inputSwitchesValue: number[] = [0,0,0,0] 

window.onload = () => {
    generateImages()
    removeInputSwitches()
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
        submitButton.classList.remove("try-again")
    })
})

submitButton?.addEventListener('click', () => {
    if(selectedChoice == null) return;
    let selection = document.getElementById("option" + multipleChoiceOptions.at(selectedChoice)!.id); 
    let quiz =  document.querySelector(".form__choices");
    if (submitButton.innerText == "Next") {
        location.reload();
        //todo: go to the next question here instead of reload (only for test mode)
        submitButton.innerText = "Submit";
        return;
    }
    else {
        if(selectedChoice == answer) {
            sound.play();
            fireConfetti();
            submitButton.innerText = "Next";
            quiz?.classList.add("next-question");
            selection?.classList.add("right-answer")
            return;
        }
        selection?.classList.add("wrong-answer")
        submitButton.classList.add("try-again")
        submitButton.innerHTML = "Try Again"
        //todo: go to the next question here 
    }
})

function fireConfetti() {
    var defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.95,
        startVelocity: 30,
        shapes: ['star'],
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
      };
        function shoot() {
        confetti({
          ...defaults,
          particleCount: 5,
          scalar: 1.2,
          shapes: ['star']
        });
        confetti({
          ...defaults,
          particleCount: 5,
          scalar: 0.9,
          shapes: ['circle']
        });
      }
      setTimeout(shoot, 0);
      setTimeout(shoot, 50);
      setTimeout(shoot, 100);
}

//Populates the question response selections
function generateImages() {
    selectionImages.at(answer)!.src = `images/d${difficulty}q${randomQuestion}.png` 
    let rand4Digits:number[] = ([0,1,2,3,4,5].filter((val)=>{if (val === randomQuestion) return false; return true})).sort(() => 0.5 - Math.random()).slice(0,4)
    for (let i:number = 0; i<4; i++) {
        if (!selectionImages.at(i)!.src === true) {
            selectionImages.at(i)!.src = `images/d${difficulty}q${rand4Digits[i]}.png` 
        }
    }    
}

function removeInputSwitches() {
    const switches = document.querySelectorAll(".switch")
    if (difficulty != 3) switches[3].remove();
    if (difficulty == 0) switches[2].remove();
}

function checkIfAnswerIsRight() {
    changeOutputValue(logicFunctions[randomQuestion](inputSwitchesValue, difficulty))
}

function changeOutputValue(inputsMatchesExpression:number | boolean) {
    if(inputsMatchesExpression) {
        output.classList.add("inputsMatchesExpression") 
        output.innerHTML = "1"
        return
    } 
    output.classList.remove("inputsMatchesExpression") 
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