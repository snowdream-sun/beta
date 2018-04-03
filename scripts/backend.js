"use strict";

// Global Variable
var FSM = {};
var USER_INPUT = Object.assign({}, JSON.parse(sessionStorage.getItem("userInput")));

// State Constructor
function State(name) { // parameter: string
    this._name = name;
    this._encoding = "";
    this._transition = {}; // state transition table
    this._outputs = {}; // output table
}

// Functions
// void function()
function initFSM() {
    FSM._inputs = USER_INPUT.inputs.slice();
    FSM._outputs = USER_INPUT.outputs.slice();
    FSM._states = USER_INPUT.states.slice(); // array of state names
    FSM._stateObj = {}; // collection of state objects with state names being the keys

    FSM._states.forEach(function(state) {
        FSM._stateObj[state] = new State(state);
    });

    FSM._resetState = FSM._stateObj[USER_INPUT.resetState];
    FSM._curState = FSM._resetState;
}

// void function()
function setFSMTransition() {
    USER_INPUT.transitionT.forEach(function(row) {
        var cur = row[0];
        var input = row[1];
        var next = row[2];

        FSM._stateObj[cur]._transition[input] = next;
    });
}

// void function()
function setFSMOutput() {
    FSM._type = USER_INPUT.type;

    if (FSM._type == "Moore") {
        USER_INPUT.outputT.forEach(function(row) {
            var cur = row[0];
            var out = row[1];

            FSM._stateObj[cur]._outputs = out;
        });
    } else {
        USER_INPUT.outputT.forEach(function(row) {
            var cur = row[0];
            var input = row[1];
            var out = row[2];

            FSM._stateObj[cur]._outputs[input] = out;
        });
    }
}

// void function()
function createFSM() {
    initFSM();
    setFSMTransition();
    setFSMOutput();
}

// string function()
function getResetState() {
    return FSM._resetState._name;
}

// string function()
function getCurState() {
    return FSM._curState._name;
}

// string function(object, string)
function readTable(table, curIn) {
    for (var input in table) {
        var pattern = new RegExp(input.replace(/X/g, "[01]"));
        if (pattern.test(curIn)) {
            return table[input];
        }
    }
    return "undefined"; // in case there are input combinations that are not covered in transition/output table
}

// string function(string)
function getCurOut(curIn) {
    if (FSM._type == "Moore") {
        return FSM._curState._outputs;
    } else {
        if (curIn == "undefined") {
            return "undefined";
        } else {
            return readTable(FSM._curState._outputs, curIn);
        }
    }
}

// string function(string)
function getNextState(curIn) {
    if (curIn == "undefined") {
        return "undefined";
    } else {
        return readTable(FSM._curState._transition, curIn);
    }
}

// void function(string)
function updateCurState(nextState) {
    FSM._curState = FSM._stateObj[nextState];
}

// string function(number)
function decimalToBinary (decimal) {
    var binary = "";

    while (decimal != 0) {
        binary = decimal % 2 + binary;
        decimal = Math.floor(decimal / 2);
    }

    return binary;
}

// void function(number)
function stateEncoding(n) {
    for (var i = 0; i < FSM._states.length; i++) {
        var binary = decimalToBinary(i);
        FSM._stateObj[FSM._states[i]]._encoding = n + "'b" + binary.padStart(n, "0");
    }
}

// void function(string, array)
function getCondition(input, condition) {
    for (var i = 0; i < FSM._inputs.length; i++) {
        if (input.charAt(i) != "X") {
            condition.push(FSM._inputs[i] + " == 1'b" + input.charAt(i));
        }
    }
}

// void function(string, array)
function assignOut(out, assignment) {
    for (var i = 0; i < FSM._outputs.length; i++) {
        assignment.push(FSM._outputs[i] + " = 1'b" + out.charAt(i) + ";\n");
    }
}

// void function(array)
function assignZero(assignment) {
    for (var i = 0; i < FSM._outputs.length; i++) {
        assignment.push(FSM._outputs[i] + " = 1'b0;\n");
    }
}

// void function(string, array)
function writeTransitionConidition(state, block) {
    var ifCount = 0;

    // retrieve from state transition table
    for (var input in FSM._stateObj[state]._transition) {
        var transition = "next_state = " + FSM._stateObj[state]._transition[input] + ";\n";
        var condition = []; // written in if ()
        getCondition(input, condition);

        if (condition.length == 0) { // all inputs are "X"
            block.push(transition);
        } else {
            if (ifCount == 0) {
                block.push("if (" + condition.join(" && ") + ")\n");
            } else {
                block.push("else if (" + condition.join(" && ") + ")\n");
            }
            block.push("\t" + transition);
            ifCount++;
        }
    }

    // default: stay in current state
    if (ifCount > 0) {
        block.push("else\n");
        block.push("\tnext_state = state;\n");
    }
}

// void function(string, array)
function writeOutputConidition(state, block) {
    var ifCount = 0;

    // retrieve from output table
    for (var input in FSM._stateObj[state]._outputs) {
        var assignment = []; // output assignments
        var condition = []; // written in if ()
        assignOut(FSM._stateObj[state]._outputs[input], assignment);
        getCondition(input, condition);

        if (condition.length == 0) { // all inputs are "X"
            assignment.forEach(function(statement) {
                block.push(statement);
            });
        } else {
            if (ifCount == 0) {
                block.push("if (" + condition.join(" && ") + ")\n");
            } else {
                block.push("else if (" + condition.join(" && ") + ")\n");
            }
            if (assignment.length > 1) {
                block.push("begin\n");
            }
            assignment.forEach(function(statement) {
                block.push("\t" + statement);
            });
            if (assignment.length > 1) {
                block.push("end\n");
            }
            ifCount++;
        }
    }

    // default: assign all outputs to zero
    if (ifCount > 0) {
        var assignment = []; // output assignments
        assignZero(assignment);
        block.push("else\n");
        assignment.forEach(function(statement) {
            block.push("\t" + statement);
        });
    }
}

// string function()
function writeVerilog() {
    // module inputs and outputs
    var code =
        "module fsm(\n" +
        "\tinput clk, reset,\n" +
        "\tinput " + FSM._inputs.join(", ") + ",\n" +
        "\toutput reg " + FSM._outputs.join(", ") + "\n" +
        ");\n";
    code += "\n";

    // registers
    // default: binary encoding
    // var nBit = Math.ceil(Math.log2(FSM._states.length)); // not compatible with IE
    var nBit = Math.ceil(Math.log(FSM._states.length) / Math.log(2)); // number of bits depends on number of states
    var msb = nBit - 1;
    if (msb == 0) {
        code += "reg state, next_state;\n";
    } else {
        code += "reg [" + msb + ":0] state, next_state;\n";
    }
    code += "\n";

    // parameters
    stateEncoding(nBit);
    code += "parameter ";
    for (var i = 0; i < FSM._states.length; i++) {
        code += FSM._states[i] + " = " + FSM._stateObj[FSM._states[i]]._encoding;
        if (i < FSM._states.length - 1) {
            code += ", ";
        } else {
            code += ";\n";
        }
    }
    code += "\n";

    // combinational block (state transition)
    code +=
        "always @(*)\n" +
        "begin\n" +
        "\tcase(state)\n";
    FSM._states.forEach(function(state) {
        // case name (state name)
        code += "\t" + state + ":\n";
        code += "\tbegin\n";

        // code block
        var block = [];
        writeTransitionConidition(state, block);
        block.forEach(function(statement) {
            code += "\t\t" + statement;
        });
        code += "\tend\n";
    });
    code +=
        "\tdefault:\n" + // default case
        "\t\tnext_state = " + FSM._resetState._name + ";\n" +
        "\tendcase\n" +
        "end\n";
    code += "\n";

    // sequential block
    // default: active rising edge
    code +=
        "always @(posedge clk, posedge reset)\n" +
        "begin\n" +
        "\tif (reset)\n" +
        "\t\tstate <= " + FSM._resetState._name + ";\n" +
        "\telse\n" +
        "\t\tstate <= next_state;\n" +
        "end\n";
    code += "\n";

    // combinational block (output)
    code +=
        "always @(*)\n" +
        "begin\n" +
        "\tcase(state)\n";
    FSM._states.forEach(function(state) {
        // case name (state name)
        code += "\t" + state + ":\n";
        code += "\tbegin\n";

        // code block
        if (FSM._type == "Moore") {
            var assignment = [];
            assignOut(FSM._stateObj[state]._outputs, assignment);
            assignment.forEach(function(statement) {
                code += "\t\t" + statement;
            });
        } else {
            var block = [];
            writeOutputConidition(state, block);
            block.forEach(function(statement) {
                code += "\t\t" + statement;
            });
        }
        code += "\tend\n";
    });
    code +=
        "\tendcase\n" +
        "end\n";
    code += "\n";

    code += "endmodule";
    return code;
}
