import confetti from 'canvas-confetti';
import { logicFunctions } from './questions.js';

const accentColor:string = "#0059b8"
const dominantColor:string = "#141414"
const contrastColor:string = "#242424"
const lightColor:string = "#f5f5f5"
const incorrectColor:string = "#D62828"
const correctColor:string = "#1CBB3B"

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

let difficulty:number = 0;
difficulty += Number(urlParams.get("difficulty")) /////////////////////// if the value gets deleted set it to zero (todo)

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
            playSound();
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


function playSound() {
    let sound = new Audio("sounds/correctSoundEffect.mp3");
    sound.play();
}

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

function generateImages() {
    selectionImages.at(0)!.src = `images/d${difficulty}q${randomQuestion}.png` 
    selectionImages.at(3)!.src = `images/d${difficulty}q${randomQuestion}.png` 
    // for (let i:number[] = []; i.length < 4;) {
    //     let x = Math.floor(Math.random() * totalNumberOfQuestions)
    //     if (!i.includes(x)) {

    //         let test = selectionImages.at(i.length-1)!.src = `images/d${difficulty}q${x}.png`

    //         if (test === answer) selectionImages.at(answer)!.src = `images/d${difficulty}q${randomQuestion}.png` ;
    //     }
    // }
    
    // for(let i = 0; i < 4; i++) {  
    //     let n = Math.floor(Math.random() * totalNumberOfQuestions)
    //     while(n != randomQuestion) {
    //         n = Math.floor(Math.random() * totalNumberOfQuestions)
    //     }
    //     selectionImages.at(i)!.src =  `images/d${difficulty}q${n}.png`
    // }
    // selectionImages.at(answer)!.src = `images/d${difficulty}q${randomQuestion}.png` 
}

function removeInputSwitches() {
    const switches = document.querySelectorAll(".switch")
    if(difficulty == 0) {
        switches[3].remove();
        switches[2].remove();
    } else if(difficulty == 1 || difficulty == 2) {
        switches[3].remove();
    }
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