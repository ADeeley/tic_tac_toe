Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

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
        case "endGame":
            counterChoice.style.display = "none";
            gameBoard.style.display = "block";
            endGame.style.display = "block";
            break;
    }
} 

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

var winningCombos = [["1","2","3"], 
                     ["4","5","6"], 
                     ["7","8","9"],
                     ["1","4","7"], 
                     ["2","5","8"], 
                     ["3","6","9"],
                     ["1","5","9"], 
                     ["7","5","3"]]; 

function placeCPUCounter() {
    /**
     * Randomly places a counter for the CPU.
     */
    var table = $("#gameBoard");
    var freeCells = [];

    // (1) identify the free cells
    $("#gameBoard tr").each(function() {
        $(this).find("td").each(function() {
            let candidate = $(this);
            if (candidate.html() == "") {
                freeCells.push(candidate);
            }
        })
    })
    if (freeCells.length <= 0) return;
    // (2) choose one free cell using the heuristic of choice
    var chosenCell = freeCells[Math.floor(Math.random() * freeCells.length)]

    // (3) place counter in that cell
    chosenCell.html(cpu.counter); 
}

function checkForEndgame() {
    /**
     * Checks the cells for matching lines by firstly generating a set of 
     * counter positions for x and for o and then checking if the 
     * cells are superset of any of the winning combos.
     */

    var cells;
    var counters = ["X", "O"];

    for (var counter of counters) {
        cells = new Set();
        $("#gameBoard tr").each(function() {
            $(this).find("td").each(function() {
                let candidate = $(this);
                if (candidate.html() == counter) {
                    cells.add(candidate.attr("id"));
                }
            })
        })

        for (var combo of winningCombos) {
            if (cells.isSuperset(combo)) {
                console.log(combo);
                highlightWinningLine(combo);
                console.log(counter + " Wins");
                return counter;
            }
        }
    }
}

function highlightWinningLine(arr) {
    /**
     * Circles the line created.
     */
    for (var i=0; i<arr.length; i++) {
        $("#"+arr[i]).addClass("highlightLine");
    }
}

function click() {
    console.log(event.target.innerHTML);
}

window.onload = function() {
    /**
     * Sets the initial variables and passes control to the main game handler.
     */
    // Set the states to elements of the DOM
    states.counterChoice = document.getElementById("counterChoice");
    states.gameBoard = document.getElementById("gameBoard");
    states.endGame = document.getElementById("endGameALert");

    var buttons = document.getElementById("buttons"); 
    buttons.addEventListener("click", eventControler.chooseCounter);
}

var eventControler = { 
    /**
     * Controls the flow of the game
     */
    chooseCounter : function() {
        players.chooseCounter(event.target.innerHTML);
        eventControler.playGame();
    },

    playGame : function() {
        console.log("Reached playgame");
        //add promise for user placing counter
        //user places counter
        //if user victory:
        //      endgame
        //else:
        //      cpu places counter
        //      if cpu victory:
        //              endgame
        //      else:
        //              add new player promise
        //      
    }

}



