let board;

init();

function init() 
{
    board = [
    '', '', '',
    '', '', '',
    '', '', ''
    ];
    render();
};

function render() 
{
    board.forEach(function(mark, index)
    {
        console.log(mark, index);
    });
};