const logo = document.querySelector('#logo');
var isXInside = true;
var isYInside = true;

//state default values are positioning the logo at the center of the screen and a base velocity value
const state = 
{
  color: 0,
  position: 
    {
        x: (window.innerWidth / 2) - (logo.clientWidth / 2),
        y: (window.innerHeight / 2) - (logo.clientHeight / 2),
    },
  velocity: 
    {
        x: 1,
        y: -1,
    }
};

//Displays the position and colors updates already done on the screen
function drawFunction() 
{
  logo.style.top = state.position.y + 'px';
  logo.style.left = state.position.x + 'px';
  logo.querySelectorAll('path').forEach(path => {path.setAttribute('fill', `hsl(${state.color % 360},100%,50%)`);});
}

//Updates the object position
function updatePosition() 
{
  var speed = Math.min(Math.max(document.querySelector('#speed').value, 0), 100);
  state.position.y += (state.velocity.y * speed);
  state.position.x += (state.velocity.x * speed);
}

//Checks for all the collisions
function collisionDetection() 
{
  //Checks if the object has reached the right side of the screen
  if (state.position.x + logo.clientWidth >= window.innerWidth) 
  {
    if(isXInside)
    {
    state.velocity.x = -state.velocity.x;
    changeColor();
    isXInside = false;
    }
  } 
  //Checks if the object has reached the left side of the screen
  else if (state.position.x <= 0) 
  {
    state.velocity.x = -state.velocity.x;
    changeColor();
  }
  else
    isXInside=true;
  
  //Checks if the object has reached the top of the screen
  if (state.position.y <= 53) 
  {
    state.velocity.y = -state.velocity.y;
    changeColor();
  } 
  //Checks if the object has reached the bottom of the screen
  else if (state.position.y + logo.clientHeight >= window.innerHeight) 
  {
    if(isYInside)
    {
    state.velocity.y = -state.velocity.y;
    changeColor();
    isYInside= false;
    }
  }
  else
    isYInside = true;
}

//Changes the color
function changeColor() 
{
  state.color = state.color + 137;
}

function start() 
{
  updatePosition();
  drawFunction();
  collisionDetection();
  requestAnimationFrame(start);
}

start();