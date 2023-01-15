export const difficultyChoices = Array.from(document.querySelectorAll<HTMLButtonElement>(".cards__button")) // each difficulty choice on index page
export let difficulty = 0

difficultyChoices.forEach(choice => {
    choice.addEventListener("click", () => {
        difficulty = Number(choice!.value)
    })
})



////////////////// idk how to change the value of an import variable
///////////////// not working 