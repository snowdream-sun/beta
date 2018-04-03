"use strict";

// Global Variable
var EG_MOORE_1 = {}; // Example: Moore #1
var EG_MOORE_2 = {}; // Example: Moore #2
var EG_MEALY = {}; // Example: Mealy

/* =========================== Example: Moore #1 =========================== */

/* ---------- Section I - Inputs, Outputs, States and Reset State ---------- */

// data type: string array
EG_MOORE_1.inputs = ["TA", "TB"];

// data type: string array
EG_MOORE_1.outputs = ["LA1", "LA0", "LB1", "LB0"];

// data type: string array
EG_MOORE_1.states = ["S0", "S1", "S2", "S3"];

// data type: string
EG_MOORE_1.resetState = "S0";

/* ---------- Section II - State Transition Table -------------------------- */

// data type: 2D string array
EG_MOORE_1.transitionT = [
//  [curState, inputs, nextState]
    [  "S0",    "0X",     "S1"  ],
    [  "S0",    "1X",     "S0"  ],
    [  "S1",    "XX",     "S2"  ],
    [  "S2",    "X0",     "S3"  ],
    [  "S2",    "X1",     "S2"  ],
    [  "S3",    "XX",     "S0"  ]
];

/* ---------- Section III - Machine Type and Output Table ------------------ */

// data type: string
EG_MOORE_1.type = "Moore"; // either "Moore" or "Mealy"

// data type: 2D string array
EG_MOORE_1.outputT = [
//  [curState, outputs] for moore machine
    [  "S0",   "0010" ],
    [  "S1",   "0110" ],
    [  "S2",   "1000" ],
    [  "S3",   "1001" ]
];

/* ---------- Section IV - Diagrams ---------------------------------------- */

// data type: string (HTML)
EG_MOORE_1.diagram =
    "<h2>State Transition Diagram</h2>" +
    "<img src='moore_1/state_transition_diagram.jpg' alt='Moore #1 State Transition Diagram'>" +
    "<h2>State Transition Table</h2>" +
    "<img src='moore_1/state_transition_table.jpg' alt='Moore #1 State Transition Table'>" +
    "<h2>Output Table</h2>" +
    "<img src='moore_1/output_table.jpg' alt='Moore #1 Output Table'>" +
    "<p>D. M. Harris and S. L. Harris, <i>Digital Design and Computer Architecture</i>, 2nd ed. Waltham, MA: Elsevier, 2013, pp. 125-127.</p>";

/* =========================== Example: Moore #2 =========================== */

EG_MOORE_2.inputs = ["A"];
EG_MOORE_2.outputs = ["Y"];
EG_MOORE_2.states = ["S0", "S1", "S2"];
EG_MOORE_2.resetState = "S0";

EG_MOORE_2.transitionT = [
    [  "S0",     "0",     "S1"  ],
    [  "S0",     "1",     "S0"  ],
    [  "S1",     "0",     "S1"  ],
    [  "S1",     "1",     "S2"  ],
    [  "S2",     "0",     "S1"  ],
    [  "S2",     "1",     "S0"  ]
];

EG_MOORE_2.type = "Moore";
EG_MOORE_2.outputT = [
    [  "S0",     "0"  ],
    [  "S1",     "0"  ],
    [  "S2",     "1"  ]
];

EG_MOORE_2.diagram =
    "<h2>State Transition Diagram</h2>" +
    "<img src='moore_2/state_transition_diagram.jpg' alt='Moore #2 State Transition Diagram'>" +
    "<h2>State Transition Table</h2>" +
    "<img src='moore_2/state_transition_table.jpg' alt='Moore #2 State Transition Table'>" +
    "<h2>Output Table</h2>" +
    "<img src='moore_2/output_table.jpg' alt='Moore #2 Output Table'>" +
    "<p>D. M. Harris and S. L. Harris, <i>Digital Design and Computer Architecture</i>, 2nd ed. Waltham, MA: Elsevier, 2013, pp. 133.</p>";

/* =========================== Example: Mealy ============================== */

EG_MEALY.inputs = ["A"];
EG_MEALY.outputs = ["Y"];
EG_MEALY.states = ["S0", "S1"];
EG_MEALY.resetState = "S0";

EG_MEALY.transitionT = [
    [  "S0",     "0",     "S1"  ],
    [  "S0",     "1",     "S0"  ],
    [  "S1",     "0",     "S1"  ],
    [  "S1",     "1",     "S0"  ]
];

EG_MEALY.type = "Mealy";
EG_MEALY.outputT = [
//  [curState, inputs, outputs] for mealy machine
    [  "S0",     "0",    "0"  ],
    [  "S0",     "1",    "0"  ],
    [  "S1",     "0",    "0"  ],
    [  "S1",     "1",    "1"  ]
];

EG_MEALY.diagram =
    "<h2>State Transition Diagram</h2>" +
    "<img src='mealy/state_transition_diagram.jpg' alt='Mealy State Transition Diagram'>" +
    "<h2>State Transition and Output Table</h2>" +
    "<img src='mealy/state_transition_output_table.jpg' alt='Mealy State Transition and Output Table'>" +
    "<p>D. M. Harris and S. L. Harris, <i>Digital Design and Computer Architecture</i>, 2nd ed. Waltham, MA: Elsevier, 2013, pp. 133-134.</p>";
