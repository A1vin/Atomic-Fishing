function atomicFishing()
{

	// constants
	var WIDTH = 800;
	var HEIGHT = 600;
	
	var canvas = document.getElementById("gameFrame");
	var context = canvas.getContext("2d");
	
	init();
	drawBackground( context );
	
	var data = new Data();
	
	setInterval( function(){ gameLoop(); }, 50 );			// For each 17 ms, start up gameLoop (if finished from last time)
		
	function init()											// initialize canvas
	{
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		canvas.style.border = "5px solid black";
		//canvas.addEventListener('mousemove', mouseMove, false);
	} // end init()
	
	// Draw background
	function drawBackground()
	{
		var img_background = new Image();
		img_background.src = "background.jpg";
		context.drawImage( img_background, 0, 0);
	} // end drawBackground()

	// 'Object' that holds the data in the game
	function Data()
	{
		this.atoms = [ new Atom( "C", WIDTH/2, -20, 10 ) ];				// create array with atoms (starts with one atom in it)
		this.moleculeBits = [ new Atom( "-", 200, 200, 10 ) ];	// collected chain starting with a collector
		this.atomTube = new Area( 200, 0, 400, HEIGHT );	// Tube where the atoms is 'raining'
		this.running = true;
	} // end Data();

	// 'Object' that defines an Atom
	function Atom( type, x, y, radius )
	{
		this.name = type;								// name of atom (abbreviation)
		this.x = x;										// position x in space
		this.y = y;									// position y in space
		this.radius = radius;							// radius in pixels
		this.timeCreated = new Date().getTime();		// When this atom was 'created'
	} // end Atom()
	
	// 'Object' that define an area
	function Area( x, y, width, height )
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	} // end Area()

	// Draw an Atom
	function drawAtom( atom )
	{
		context.beginPath();
		context.arc( data.atomTube.x + atom.x, atom.y, atom.radius, 0, 2*Math.PI, true );
		context.fillStyle = 'rgb(255, 255, 0)';
		context.lineWidth = 1;
		context.fill();
		context.fillStyle = 'rgb(0, 0, 0)';
		context.font = "normal "+atom.radius*1.4+"px Verdana";
		context.fillText(atom.name, data.atomTube.x + atom.x - (atom.radius/2), atom.y+(atom.radius/2));
	} // end drawAtom()

	// Create and draw a frame
	function gameLoop()
	{
		update();
		render();
	} // end gameLoop()


	// Update data according to last screen
	function update()
	{
		for( i = 0; i < data.atoms.length; i++ )
		{
			data.atoms[i].y += 3;
		}
		timeDiff = new Date().getTime() - data.atoms[data.atoms.length - 1].timeCreated;
		if( timeDiff > 750 )
			data.atoms[data.atoms.length] = new Atom( String.fromCharCode(Math.floor( Math.random() * 26 ) + 65 ), Math.floor( Math.random() * data.atomTube.width ), -20, Math.floor(Math.random()*12)+8 );
	} // end update()


	// Render a scene
	function render()
	{
		if( data.running )
		{
			drawBackground();
			
			for( i = 0; i < data.atoms.length; i++ )
			{
				drawAtom( data.atoms[i] );
			}
			
			// draw the collected chain
			for( i = 0; i < data.moleculeBits.length; i++ )
			{
				drawAtom( data.moleculeBits[i] );
			}
		}
	} // end render()
} // end AtomicFishing()







