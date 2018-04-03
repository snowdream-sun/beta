"use strict";

// Functions
function loadEgI() {
    location = "page.html";
    sessionStorage.setItem("userInput", JSON.stringify(EG_MOORE_1));
    sessionStorage.setItem("fsmName", "Example: Moore #1");
}

function loadEgII() {
    location = "page.html";
    sessionStorage.setItem("userInput", JSON.stringify(EG_MOORE_2));
    sessionStorage.setItem("fsmName", "Example: Moore #2");
}

function loadEgIII() {
    location = "page.html";
    sessionStorage.setItem("userInput", JSON.stringify(EG_MEALY));
    sessionStorage.setItem("fsmName", "Example: Mealy");
}

function toEnterInput() {
    location = "https://lstevenll.github.io/";
}

// Events
document.getElementById("egI").onclick = loadEgI;
document.getElementById("egII").onclick = loadEgII;
document.getElementById("egIII").onclick = loadEgIII;
document.getElementById("userDesign").onclick = toEnterInput;
