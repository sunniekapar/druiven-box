const difficultySelections = Array.from(document.querySelectorAll<HTMLButtonElement>(".cards__button")) 

difficultySelections.forEach(choice => {
    choice.addEventListener("click", () => {     
        window.location.assign("questions.html?difficulty=" + choice!.value)
    })
})