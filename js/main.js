Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

var player = {
    counter : undefined
}

var cpu = {
    counter : undefined
}

var winningCombos = [["1","2","3"], ["4","5","6"], ["7","8","9"],
                           ["1","4","7"], ["2","5","8"], ["3","6","9"],
                           ["1","5","9"], ["7","5","3"]]; 

function counterChoice() {
    /**
     * Displays two buttons, giving the player a choice of X's or O's.
     */
    var instructText = $("<h2 id='instructText'>Choose your marker</h2>")
    $("#content").empty();
    var orTxt = $("<h3 id='counterOr'>or</h3>");
    var xBtn = $("<button id='xButton' class='counterChoiceButton'>X</button")
        .text("X")
    var oBtn = $("<button id='oButton' class='counterChoiceButton'>O</button")
        .text("O");
    var box = $("<div class='counterChoice'></div>")
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
     * Checks the cells for matching lines by firstly generating a set of 
     * counter positions for x and for o and then checking if the 
     * cells are superset of any of the winning combos.
     */
    var xCells = new Set();
    var oCells = new Set();

    $("#gameBoard tr").each(function() {
        $(this).find("td").each(function() {
            let candidate = $(this);
            if (candidate.html() == "X") {
                xCells.add(candidate.attr("id"));
            }
            else if (candidate.html() == "O") {
                oCells.add(candidate.attr("id"));
            }
        })
    })

    for (var combo of winningCombos) {
        if (xCells.isSuperset(combo)) {
            console.log(combo);
            highlightWinningLine(combo);
            console.log("X Wins");
            return "X";
        }
    }

    for (var combo of winningCombos) {
        if (oCells.isSuperset(combo)) {
            console.log(combo);
            highlightWinningLine(combo);
            console.log("O Wins");
            return "O";
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

function declareWinner(winner) {
    var alertBacking = $("<div></div>")
        .attr("id", "alertBacking");
    var alertText = $("<h2>" + winner + " wins</h2>");
    alertBacking.append(alertText);
    $("#gameBoard").append(alertBacking);
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
        if ($(this).html() == "" && gameCompleted == false) {
            $(this).html(player.counter);
            var victor = checkForEndgame();
            if (victor) {
                gameCompleted = true;
                return endGameSequence(victor);
            }
            // CPU turn
            setTimeout(placeCPUCounter, Math.random()* 1000);
            checkForEndgame();
            var victor = checkForEndgame();
            if (victor) {
                gameCompleted = true;
                return endGameSequence(victor);
            }
        }
    })
}
