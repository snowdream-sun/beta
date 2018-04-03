"use strict";

// Functions
function fillInSpecs() {
    document.getElementById("fsmName").innerHTML = sessionStorage.getItem("fsmName");

    document.getElementById("thInputs").innerHTML = "Inputs [" + FSM._inputs.length + "]";
    document.getElementById("thOutputs").innerHTML = "Outputs [" + FSM._outputs.length + "]";
    document.getElementById("thStates").innerHTML = "States [" + FSM._states.length + "]";

    document.getElementById("specInputs").innerHTML = FSM._inputs.join(", ");
    document.getElementById("specOutputs").innerHTML = FSM._outputs.join(", ");
    document.getElementById("specStates").innerHTML = FSM._states.join(", ");
    document.getElementById("specReset").innerHTML = FSM._resetState._name;
    document.getElementById("specType").innerHTML = FSM._type;

    document.getElementById("thCurIn").innerHTML = "Current Inputs<br>" + FSM._inputs.join(", ");
    document.getElementById("thCurOut").innerHTML = "Current Outputs<br>" + FSM._outputs.join(", ");
}

function generateInputCombi() {
    var n = FSM._inputs.length;

    for (var i = 0; i < Math.pow(2, n); i++) {
        var combi = document.createElement("option");
        combi.value = decimalToBinary(i).padStart(n, "0");
        combi.text = combi.value;
        document.getElementById("curIn").add(combi);
    }
}

function displayDiagram() {
    if (USER_INPUT.diagram) {
        document.getElementById("diagram").innerHTML = USER_INPUT.diagram;
    }
}

function changeInput() {
    var curIn = document.getElementById("curIn").value;
    var curOut = getCurOut(curIn);
    var nextState = getNextState(curIn);

    if (curOut == "undefined") {
        document.getElementById("curOut").innerHTML = // default: assign all outputs to zero
            "<mark title='By default'>" + "0".repeat(FSM._outputs.length) + "</mark>";
    } else {
        document.getElementById("curOut").innerHTML = curOut;
    }

    if (nextState == "undefined") {
        document.getElementById("nextState").innerHTML = // default: stay in current state
            "<mark title='By default'>" + getCurState() + "</mark>";
    } else {
        document.getElementById("nextState").innerHTML = nextState;
    }
}

function updatePanel() {
    document.getElementById("curState").innerHTML = getCurState();
    changeInput();
}

function activeClkEdge() {
    var curIn = document.getElementById("curIn").value;
    if (curIn == "undefined") {
        return;
    }
    var nextState = getNextState(curIn);
    if (nextState == "undefined") {
        return;
    }
    updateCurState(nextState);
    updatePanel();
}

function asyncReset() {
    updateCurState(getResetState());
    document.getElementById("curIn").value = "undefined";
    updatePanel();
}

function displayVerilog() {
    document.getElementById("hdl").innerHTML = writeVerilog();
}

// Events
document.getElementById("curIn").onchange = changeInput;
document.getElementById("clkEdgeBtn").onclick = activeClkEdge;
document.getElementById("resetBtn").onclick = asyncReset;
document.getElementById("verilogBtn").onclick = displayVerilog;

// Running
createFSM();
fillInSpecs();
generateInputCombi();
displayDiagram();
updatePanel();
