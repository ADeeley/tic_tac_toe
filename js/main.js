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

function createBoard() {
    /**
     * Displays the game board and waits for the player to place a piece.
     */
    var board = $("<table><tr><td></td><td></td><td></td><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>")
        .addClass("board");
    $("#content").append(board);
}
window.onload = function() {
    counterChoice();
    $("button").click(function() {
        if ($(this).text() == "X") {
            $("#content").empty();
            createBoard();
        }
        else {
            $("#content").empty();
            createBoard();
        }
    })
}
