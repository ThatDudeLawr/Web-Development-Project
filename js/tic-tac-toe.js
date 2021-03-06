var origBoard;
var huPlayer='X';
var aiPlayer='0';
var huScore=0;
var aiScore=0;
var gameCompleted = false;
var turnCount=1; // Being used to know which player turn it is during Multi Player
var multiplayer = 0;

//Display current Score
document.querySelector('.playerscore').textContent = huScore;
document.querySelector('.aiscore').textContent = aiScore;
document.querySelector('.player1').textContent = "Player: ";
document.querySelector('.player2').textContent = "Computer: ";

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

function startMultiplayer()
{
    multiplayer=1;
    huScore=0;
    aiScore=0;
    //Display 2 players instead of Player/Computer
    document.querySelector('.playerscore').textContent = huScore;
    document.querySelector('.aiscore').textContent = aiScore;
    document.querySelector('.player1').textContent = "Player 1 (X):";
    document.querySelector('.player2').textContent = "Player 2 (0): ";
    startGame();
}

function startSinglePlayer()
{
    multiplayer=0;
    huScore=0;
    aiScore=0;
    //Display Player/Computer instead of 2 Players
    document.querySelector('.playerscore').textContent = huScore;
    document.querySelector('.aiscore').textContent = aiScore;
    document.querySelector('.player1').textContent = "Player: ";
    document.querySelector('.player2').textContent = "Computer: ";
    startGame();
}

//Resets all the table values and removes all the set properties
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
    
    turnCount=1;

}

//Player 1 turn
function xTurn(square)
{
    //Checks if the selected cell is free
    if(typeof origBoard[square.target.id] == 'number')
    {
        turn(square.target.id, huPlayer);
        if(!gameCompleted)
            checkTie();
        turnCount++;
    }
}

//Player 2 turn
function oTurn(square)
{
    //Checks if the selected cell is free
    if(typeof origBoard[square.target.id] == 'number')
    {
        turn(square.target.id, aiPlayer);
        if(!gameCompleted)
            checkTie();
        turnCount++;
    }
}

function turnClick(square)
{
   if(multiplayer==1)
    {
            if(turnCount%2==0)
            {
                oTurn(square);
            }   
            else
            {
                xTurn(square);
            }
    } 
    else
    //Checks if the selected cell is free
    if(typeof origBoard[square.target.id] == 'number')
    {
        turn(square.target.id, huPlayer);
        if(!gameCompleted)
            if(!checkTie())
                turn(bestSpot(), aiPlayer);
        turnCount++;
    }
}

//Sets the selected square with the player value and updates the board with that character
function turn(squareId, player)
{
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if(gameWon)
        gameOver(gameWon);
}

//Checks if one of the players has the winning combination
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

//Triggers the table style modifications and the game over message box
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
    if(gameWon.player==huPlayer && multiplayer==1)
    {   
        declareWinner("Winner Player 1!");
    }
    else if(gameWon.player==aiPlayer && multiplayer==1)
    {
        declareWinner("Winner Player 2!")
    }
    else if(gameWon.player==huPlayer)
    {
        declareWinner("You Win!")
    }
    else
    {
        declareWinner("You Lose!");
    }
}

//Specifies which player won inside the game over box
function declareWinner(who)
{
    document.querySelector(".endgame").style.display="block";
    document.querySelector(".endgame .text").innerText= who;
}

//Checks if the table has any empty cells
function emptySquares()
{
    return origBoard.filter(s => typeof s == "number");
}

//Finds the best position where the AI can place his symbol
function bestSpot()
{   
        return minimax(origBoard, aiPlayer).index;
        //return emptySquares()[0];
}

//Checks if there is a tie
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

//Minimax algorithm in order to settle which table positions are the best to be played
function minimax(newBoard, player) 
{
	var availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) 
    {
		return {score: -10};
    } 
    else if (checkWin(newBoard, aiPlayer)) 
    {
		return {score: 10};
    } 
    else if (availSpots.length === 0) 
    {
		return {score: 0};
    }
    
    var availableMoves = [];
    
    for (var i = 0; i < availSpots.length; i++) 
    {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

        if (player == aiPlayer) 
        {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
        } 
        else 
        {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		availableMoves.push(move);
	}

	var bestMove;
    if(player === aiPlayer) 
    {
		var bestScore = -10000;
        for(var i = 0; i < availableMoves.length; i++) 
        {
            if (availableMoves[i].score > bestScore) 
            {
				bestScore = availableMoves[i].score;
				bestMove = i;
			}
		}
    }
    else 
    {
		var bestScore = 10000;
        for(var i = 0; i < availableMoves.length; i++) 
        {
            if (availableMoves[i].score < bestScore) 
            {
				bestScore = availableMoves[i].score;
				bestMove = i;
			}
		}
	}
	return availableMoves[bestMove];
}