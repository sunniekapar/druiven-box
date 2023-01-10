const form = document.getElementById("form") as HTMLFormElement | null
const input = document.getElementById("option1") as HTMLInputElement | null

form?.addEventListener("submit", e => {
    console.log("works")
    e.preventDefault()

    if(input?.value == "" || input?.value == null) {
        console.log("your mom")
    }

})

