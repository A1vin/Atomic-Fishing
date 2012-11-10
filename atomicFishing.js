function atomicFishing()
{
	var context = init( 800, 600 );
	drawBackground( context );
	var data = new gameData();
	
	setInterval( function(){ gameLoop( context, data ); }, 50 );			// For each 17 ms, start up gameLoop (if finished from last time)
}

// 'Object' that holds the data in the game
function gameData()
{
	this.atoms = [ new Atom( "C", 7, 10 ) ];
	this.atomTube = new Area( 200, 400 );
	this.running = true;
}


// 'Object' that defines an Atom
function Atom( type, x, radius )
{
	this.name = type;								// name of atom (abbreviation)
	this.timeCreated = new Date().getTime();		// When this atom was 'created'
	this.radius = radius;							// radius in pixels
	this.x = x;										// position x in space
	this.y = -20;										// position y in space
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
	var atom = data.atoms[index];
	context.beginPath();
	context.arc( data.atomTube.x + atom.x, atom.y, atom.radius, 0, 2*Math.PI, true );
	context.fillStyle = 'rgb(255, 255, 0)';
	context.lineWidth = 1;
	context.fill();
	context.fillStyle = 'rgb(0, 0, 0)';
	context.font = "normal "+data.atoms[index].radius*1.4+"px Verdana";
	context.fillText(atom.name, data.atomTube.x + atom.x - (atom.radius/2), atom.y+(atom.radius/2));
}

// Create and draw a frame
function gameLoop( context, data )
{
	update( context, data );
	render( context, data );
}


// Update data according to last screen
function update( context, data )
{
	for( i = 0; i < data.atoms.length; i++ )
	{
		data.atoms[i].y += 3;
	}
	timeDiff = new Date().getTime() - data.atoms[data.atoms.length - 1].timeCreated;
	if( timeDiff > 750 )
		data.atoms[data.atoms.length] = new Atom( String.fromCharCode(Math.floor( Math.random() * 26 ) + 65 ), Math.floor( Math.random() * data.atomTube.width ), Math.floor(Math.random()*12)+8 );
}


// Render a scene
function render( context, data )
{
	if( data.running )
	{
		drawBackground( context );
		
		for( i = 0; i < data.atoms.length; i++ )
		{
			drawAtom( context,  data, i );
		}
	}
}