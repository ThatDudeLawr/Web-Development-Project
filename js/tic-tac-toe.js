var origBoard;
var huPlayer='X';
var aiPlayer='0';
var huScore=0;
var aiScore=0;
var gameCompleted = false;
document.querySelector('.playerscore').textContent = huScore;
document.querySelector('.aiscore').textContent = aiScore;

const winCombos=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];

const cells = document.querySelectorAll('.cell');



startGame();



function startGame()
{
    gameCompleted = false;
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    console.log("origBoard = " + origBoard);
    for(var i=0; i< cells.length;i++)
    {
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
         
    }
}

function turnClick(square)
{
    //Checks if the selected cell is free
    if(typeof origBoard[square.target.id] == 'number')
    {
        turn(square.target.id, huPlayer);
        if(!gameCompleted)
            if(!checkTie())
                turn(bestSpot(), aiPlayer);
    }

}

//Sets the selected square with the player value(x) and updates the board
function turn(squareId, player)
{
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if(gameWon)
        gameOver(gameWon);
}

function checkWin(board, player)
{   
    // Check on which indexes of the board are the player symbols and saves those indexes into the "a" array
    let plays = board.reduce((a,e,i) => (e===player) ? a.concat(i) : a , [] ) 
    let gameWon = null;
    for(let [index,win] of winCombos.entries())
    {
         if(win.every(elem => plays.indexOf(elem) > -1))
         {
             gameWon={index: index, player: player};
             break;
         }
    }
    return gameWon;
}

function gameOver(gameWon)
{
    gameCompleted = true;
    for(let index of winCombos[gameWon.index])
    {
        document.getElementById(index).style.backgroundColor = 
        gameWon.player == huPlayer ? "green" : "red";
    }
    gameWon.player == huPlayer ? huScore++ : aiScore++;
    document.querySelector('.playerscore').textContent = huScore;
    document.querySelector('.aiscore').textContent = aiScore;
    for(var i=0; i<cells.length; i++)
    {
        cells[i].removeEventListener('click', turnClick, false);
    }
    if(gameWon.player==huPlayer)
    {   
        declareWinner("You Win!");
    }
    else
    {
        declareWinner("You Lose!");
    }
}

function declareWinner(who)
{
    document.querySelector(".endgame").style.display="block";
    document.querySelector(".endgame .text").innerText= who;
}

function emptySquares()
{
    return origBoard.filter(s => typeof s == "number");
}

function bestSpot()
{
    return emptySquares()[0];
}

function checkTie()
{
    if(emptySquares().length == 0)
    {
        for(var i = 0; i<cells; i++)
        {
            cells[i].style.backgroundColor = "blue";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

