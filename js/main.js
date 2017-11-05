var player = {
    counter : undefined
}

function counterChoice() {
    /**
     * Displays two buttons, giving the player a choice of X's or O's.
     */
    $("#content").empty();
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
        .append(xBtn, oBtn);

    $("#content").append(box);
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
    var board = $("<table><tr><td></td><td></td><td></td><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>")
        .addClass("board")
        .attr("id", "gameBoard");
    $("#content").append(board);
}

window.onload = function() {
    // First screen - counter choice

    counterChoice();
    $("button").one("click", function() {
        player.counter = $(this).html();
        console.log("Player has chosen : " + player.counter);
        createBoard();
        mainGameHandler();
    })
}

function mainGameHandler() {
    /**
     * Control is passed to this function when the player has chosen a counter type.
     */
    console.log("MainGame Handler");
    $("#gameBoard td").on("click", function() {
        console.log("Recorded click");
        $(this).html("Test");
    })

}
