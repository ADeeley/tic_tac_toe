Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

// Utilities ==================================================

function getCellsContaining(val) {
    /**
     * Returns an array of objects containing the given value
     */
    var table = document.getElementById("gameBoard");

    // identify the free cells
    var chosenCells = [];
    var cell;
    for (r=0; r<3; r++) {
        for (c=0; c<3; c++) {
            cell = table.rows[r].cells[c];
            if (cell.innerHTML == val) {
                chosenCells.push(cell);
            }
        }
    }

    return chosenCells;
}

// State object ================================================

var states  = {
    counterChoice : null,
    gameBoard : null,
    endGame : null

}

states.changeTo = function(changeTo) {
    switch (changeTo) {
        case "counterChoice":
            states.counterChoice.style.display = "block";
            states.gameBoard.style.display = "none";
            states.endGame.style.display = "none";
            break;
        case "gameBoard":
            states.counterChoice.style.display = "none";
            states.gameBoard.style.display = "block";
            states.endGame.style.display = "none";
            break;
        case "endgame":
            states.counterChoice.style.display = "none";
            states.gameBoard.style.display = "block";
            states.endGame.style.display = "block";
            break;
    }
} 

// Player object ================================================

var players = {
    user : undefined,
    cpu : undefined
}

players.chooseCounter = function(choice) {
    if (choice === "X") {
        players.user = "X";
        players.cpu = "O";
    }
    else {
        players.user = "O";
        players.cpu = "X";
    }
    console.log("Player has chosen : " + players.user);
    console.log("CPU is: " + players.cpu);
}

// Game object ================================================

function Game() {
    winningCombos = [["1","2","3"], 
                         ["4","5","6"], 
                         ["7","8","9"],
                         ["1","4","7"], 
                         ["2","5","8"], 
                         ["3","6","9"],
                         ["1","5","9"], 
                         ["7","5","3"]]; 
    var pendingCPUMove = false;
    var endgame = false;
    // Keep a reference to this object - used for event handling where
    // "this" refers to the object that called the event.
    var self = this;

    this.playerTurn = function() {
        if (states.gameBoard.style.display === "block" &! pendingCPUMove &! endgame) {
            pendingCPUMove = true;
            event.target.innerHTML = players.user;
            if (!self.checkForEndgame()){
                setTimeout(self.cpuTurn, 1000);
            }
        }
    }

    this.cpuTurn = function() {
        /**
         * Randomly places a counter for the CPU.
         */
        freeCells = getCellsContaining("");

        if (freeCells.length <= 0) return;
        // choose one free cell using the heuristic of choice
        var choice = Math.floor(Math.random() * freeCells.length);
        freeCells[choice].innerHTML = players.cpu;

        pendingCPUMove = false;
        self.checkForEndgame();
    }

    this.checkForEndgame = function() {
        /**
         * Checks the cells for matching lines by firstly generating a set of 
         * counter positions for x and for o and then checking if the 
         * cells are superset of any of the winning combos.
         */

        var cells;
        var counters = ["X", "O"];
        for (var counter of counters) {
            cells = new Set();
            for (var cell of getCellsContaining(counter)) {
                cells.add(cell.id);
            }

            for (var combo of winningCombos) {
                if (cells.isSuperset(combo)) {
                    this.highlightWinningLine(combo);
                    endgame = true;
                    self.declareWinner(counter);
                    return true;
                }
            }
        }
        return false;
    }

    this.highlightWinningLine = function(arr) {
        /**
         * Circles the line created.
         */
        for (var i=0; i<arr.length; i++) {
            document.getElementById(arr[i]).className += "highlightLine";
        }
    }
    
    this.declareWinner = function(winner) {
        states.changeTo("endgame");
        var gameAlert = document.getElementById("alert");

        gameAlert.innerHTML = winner + " Wins!";

    }

    this.reset = function() {
        // loop over board - set all cells to "".
        // set the game state to counerChoice

        var table = document.getElementById("gameBoard");
        console.log("Reseting");
        for (r=0; r<3; r++) {
            for (c=0; c<3; c++) {
                table.rows[r].cells[c].innerHTML = "";
            }
        }
        states.changeTo("counterChoice");
        endgame = false;
        pendingCPUMove = false;
        console.log("Endgame =" + endgame + " CPUMove = " + pendingCPUMove);
    }
};

window.onload = function() {
    /**
     * Sets the initial variables and passes control to the main game handler.
     */
    var game = new Game();
    // Set the states to elements of the DOM
    states.counterChoice = document.getElementById("counterChoice");
    states.gameBoard = document.getElementById("gameBoard");
    states.endGame = document.getElementById("endGameAlert");

    // Event lister for the counter choice
    var buttons = document.getElementById("buttons"); 
    buttons.addEventListener("click", eventControler.chooseCounter);
    
    var buttons = document.getElementById("gameBoard"); 
    buttons.addEventListener("click", game.playerTurn);

    var reset = document.getElementById("reset"); 
    reset.addEventListener("click", game.reset);
}

var eventControler = { 
    /**
     * Controls the flow of the game
     */
    chooseCounter : function() {
        if (event.target.id == "oButton" || event.target.id == "xButton") {
            console.log(event.target);
            players.chooseCounter(event.target.innerHTML);
            states.changeTo("gameBoard");
        }
    },
}
