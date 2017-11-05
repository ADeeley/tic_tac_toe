var player = {
    counter : undefined
}

var cpu = {
    counter : undefined
}

var winningCombinations = [["1","2","3"], ["4","5","6"], ["7","8","9"],
                           ["1","4","7"], ["2","5","8"], ["3","6","9"],
                           ["1","5","9"], ["7","5","3"]]; 

function counterChoice() {
    /**
     * Displays two buttons, giving the player a choice of X's or O's.
     */
    var instructText = $("<h2>Choose your marker</h2>")
        .attr("id", "instructText");
    $("#content").empty();
    var orTxt = $("<h3>or</h3>") 
        .attr("id", "counterOr");
    var xBtn = $("<button></button")
        .text("X")
        .addClass("counterChoiceButton")
        .attr("id", "xButton");
    var oBtn = $("<button></button")
        .text("O")
        .addClass("counterChoiceButton")
        .attr("id", "oButton");
    var box = $("<div></div>")
        .addClass("counterChoice")
        .append(xBtn, orTxt, oBtn);

    $("#content").append(instructText, box);
}

function gameComplete() {
    /**
     * Iterates over the board and checks for any completed lines.
     */
    $("#gameBoard tr").each(function() {
        $(this).find("td").each(function() {
            $(this).html("test");
        })
    })
}

function createBoard() {
    /**
     * Displays the game board and waits for the player to place a piece.
     */
    $("#content").empty();
    var board = $("<table><tr><td id='1'></td><td id='2'></td><td id='3'></td><tr><td id='4'></td><td id='5'></td><td id='6'></td></tr><tr><td id='7'></td><td id='8'></td><td id='9'></td></tr></table>")
        .addClass("board")
        .attr("id", "gameBoard");
    $("#content").append(board);

}

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
     * Checks the cells for matching lines.
     */
    // (1) generate array of counter positions for x and for o
    // (2) for x and o, separately, check if any of the winning combinations are within
    // the arrays
    var xCells = [];
    var oCells = [];

    $("#gameBoard tr").each(function() {
        $(this).find("td").each(function() {
            let candidate = $(this);
            if (candidate.html() == "X") {
                xCells.push(candidate.attr("id"));
            }
            else if (candidate.html() == "O") {
                oCells.push(candidate.attr("id"));
            }
        })
    })
    //console.log("Xcells: " + xCells + " oCells: " + oCells);

    // Check for X
    for (var i=0; i<winningCombinations.length; i++) {
        var matches = 0;
        for (var j=0; j<winningCombinations[i].length; j++) {
            if (xCells.indexOf(winningCombinations[i][j]) != -1) {
                matches++;
            }
        }
        if (matches == 3) {
            console.log("X Wins");
            return "X";
        }
    }
    
    // Check for O
    for (var i=0; i<winningCombinations.length; i++) {
        var matches = 0;
        for (var j=0; j<winningCombinations[i].length; j++) {
            if (oCells.indexOf(winningCombinations[i][j]) != -1) {
                matches++;
            }
        }
        if (matches == 3) {
            console.log("O Wins");
            return "O";
        }
    }
    // no winners
    return -1;
}

window.onload = function() {
    // First screen - counter choice

    counterChoice();
    $("button").one("click", function() {
        player.counter = $(this).html();
        if ($(this).html() == "X") {
            cpu.counter = "O";
        }
        else {
            cpu.counter = "X";
        }

        console.log("Player has chosen : " + player.counter);
        console.log("CPU is: " + cpu.counter);
        createBoard();
        mainGameHandler();
    })
}

function endGameSequence(victor) {
    console.log("Victory for " + victor);
}

function mainGameHandler() {
    /**
     * Control is passed to this function when the player has chosen a counter type.
     */
    var gameCompleted = false;
    console.log("MainGame Handler");
    $("#gameBoard td").on("click", function() {
        console.log("Recorded click");
        if ($(this).html() == "" && gameCompleted == false) {
            console.log("Valid click");

            $(this).html(player.counter);
            var victor = checkForEndgame();
            if (victor != -1) {
                gameCompleted = true;
                return endGameSequence(victor);
            }
            // CPU turn
            placeCPUCounter();
            checkForEndgame();
            var victor = checkForEndgame();
            if (victor != -1) {
                gameCompleted = true;
                return endGameSequence(victor);
            }
        }
        
    })

}
