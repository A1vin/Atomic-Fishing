function atomicFishing()
{
	var context = init( 800, 600 );
	drawBackground( context );
	var data = new gameData();
	
	gameLoop( context, data );
	setInterval( gameLoop( context, data ), 50 );			// For each 17 ms, start up gameLoop (if finished from last time)
}

// 'Object' that holds the data in the game
function gameData()
{
	this.atoms = [];
	this.atomTube = new Area( 200, 400 );
	//this.atomTube.x = 200;
	//this.atomTube.width = 400;
	this.running = false;
}


// 'Object' that defines an Atom
function Atom( x, y )
{
	this.name = "C";								// name of atom (abbreviation)
	this.timeCreated = new Date().getTime();		// When this atom was 'created'
	this.radius = 15;								// radius in pixels
	this.x = this.timeCreated % 100 + x;										// position x in space
	this.y = this.timeCreated % 100 + y;										// position y in space
}


// 'Object' that define an area
function Area( x, width, y, height )
{
	this.x = x;
	this.width = width;
	if( typeof(y) === 'undefined' )
		y = 0;
	else
		this.y = y;
	if( typeof(height) === 'undefined' )
		height = 0;
	else
		this.height = height;
}

// initialize canvas and set context
function init( width, height)
{
	var canvas = document.getElementById("gameFrame");
	canvas.width = width;
	canvas.height = height;
	canvas.style.border = "5px solid black";
	//canvas.addEventListener('mousemove', mouseMove, false);
	var context = canvas.getContext("2d");
	
	return context;
}


// Draw background
function drawBackground( context )
{
	var img_background = new Image();
	img_background.src = "background.jpg";
	context.drawImage( img_background, 0, 0);
}


// Draw an Atom
function drawAtom( context, data, index )
{
	atom = data.atoms[index];
	context.beginPath();
	context.arc( data.atomTube.x + atom.x, atom.y, atom.radius, 0, 2*Math.PI, true );
	context.strokeStyle = 'rgb(255, 255, 0)';
	context.lineWidth = 10;
	context.stroke();
}

// Creates on frame
function gameLoop( context, data )
{
	update( context, data );
	render( context, data );
}


// Update data according to last screen
function update( context, data )
{
	data.atoms[data.atoms.length] = new Atom( 50, 50 );
}


// Render a scene
function render( context, data )
{
	for( i = 0; i < data.atoms.length; i++ )
	{
		drawAtom( context,  data, i );
	}
}