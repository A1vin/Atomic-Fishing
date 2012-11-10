function atomicFishing()
{
	var canvas = document.getElementById("gameFrame");
	canvas.width = 800;
	canvas.height = 600;
	canvas.style.border = "5px solid black";
	var context = canvas.getContext("2d");
	var img_background = new Image();
	img_background.src = "background.jpg";
	context.drawImage( img_background, 0, 0);
}
