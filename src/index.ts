const inputSwitches = Array.from(document.querySelectorAll<HTMLInputElement>(".checkbox")) // inputs
const output = document.querySelector(".output") as HTMLParagraphElement // output text

let inputSwitchesValue: number[] = [0,0,0,0] // all zero since all switches are not checked loaded in

// checks if the answer is right
function checkAnswer(a:number, b:number, c:number, d:number) {
    if(a == 1 && b == 1) {
       output.innerHTML = "1"
       return
    }
    output.innerHTML = "0"
}
changeValues()
// updates the value after a switch is pressed
function changeValues() {
    for(let i = 0; i < inputSwitchesValue.length; i++) {
        inputSwitchesValue[i] = Number(inputSwitches.at(i)?.value)
    }
    checkAnswer(inputSwitchesValue[0], inputSwitchesValue[1], inputSwitchesValue[2], inputSwitchesValue[3])
}

// changes the value of each switch
inputSwitches.forEach(inputSwitch => {
    inputSwitch.addEventListener('click', () => { 
        inputSwitch.value = String(Math.abs(Number(inputSwitch.value) - 1))
        changeValues()
    })
})



