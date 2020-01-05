var coll = document.getElementsByClassName("dropdown");
var i;

for (i = 0; i < coll.length; i++) 
{
  if(coll[i].addEventListener)
  coll[i].addEventListener("click", function(){expand_dropdown(this);},true);
}

function expand_dropdown(a)
{
  a.classList.toggle("active");
  var content = a.nextElementSibling;
  if (content.style.maxHeight)
  {
    content.style.maxHeight = null;
  } 
  else 
  {
    content.style.maxHeight = content.scrollHeight + "px";
  } 
}