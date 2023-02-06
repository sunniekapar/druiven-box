// build/dist/firstPage.js
var difficultySelections = Array.from(document.querySelectorAll(".cards__button"));
difficultySelections.forEach((choice) => {
  choice.addEventListener("click", () => {
    window.location.assign("questions.html?difficulty=" + choice.value);
  });
});
//# sourceMappingURL=firstPage.js.map
