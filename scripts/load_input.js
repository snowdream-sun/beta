"use strict";

// Functions
function loadEgI() {
    sessionStorage.setItem("userInput", JSON.stringify(EG_MOORE_1));
    sessionStorage.setItem("fsmName", "Example: Moore #1");
    location = "page.html";
}

function loadEgII() {
    sessionStorage.setItem("userInput", JSON.stringify(EG_MOORE_2));
    sessionStorage.setItem("fsmName", "Example: Moore #2");
    location = "page.html";
}

function loadEgIII() {
    sessionStorage.setItem("userInput", JSON.stringify(EG_MEALY));
    sessionStorage.setItem("fsmName", "Example: Mealy");
    location = "page.html";
}

function toEnterInput() {
    location = "https://lstevenll.github.io/";
}

// Events
document.getElementById("egI").onclick = loadEgI;
document.getElementById("egII").onclick = loadEgII;
document.getElementById("egIII").onclick = loadEgIII;
document.getElementById("userDesign").onclick = toEnterInput;
