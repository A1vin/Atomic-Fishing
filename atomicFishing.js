function atomicFishing()
{
	// constants
	var WIDTH = 800;
	var HEIGHT = 600;
	
	var canvas = document.getElementById("gameFrame");
	var context = canvas.getContext("2d");
	
	var atomListMass = [
	1,4,12,
	14,16,19,
	23,24,26,
	28,30,32,
	35,40,40
	];
	var atomListName = [
	"H", "He", "C",
	"N", "O", "F",
	"Na","Mg","Al",
	"Si","P", "S",
	"Cl","Ar", "Ca"
	];
	
	init();
	
	var data = new Data();
	
	setInterval( function(){ gameLoop(); }, 50 );			// For each 17 ms, start up gameLoop (if finished from last time)
	canvas.addEventListener("mousemove", moveChain, false );// Move chain on mouse movement when control is activated
	
	canvas.onmousedown = function( e )
	{
		data.pinX = e.pageX - this.offsetLeft;
		data.pinY = e.pageY - this.offsetTop;
		if( data.pinX > data.atomChain[0].x - 10 && data.pinX < data.atomChain[0].x + 10 &&
			data.pinY > data.atomChain[0].y - 10 && data.pinY < data.atomChain[0].y + 10 )
			data.directChain = true;			// if clicked in or around 'picker', control = true
	};
	
	function getDistance(atomOne, atomTwo)
	{
		var xDist, yDist;
		xDist = (atomOne.x - atomTwo.x);
		if (xDist < 0){
				xDist *= -1;
			}
		yDist = (atomOne.y - atomTwo.y);
		if (yDist < 0){
				yDist *= -1;
			}
		
		return (Math.sqrt(Math.pow(xDist, 2) * Math.pow(yDist, 2))); 
	}
	
	function collisionCheck(currentAtom)
	{
		for (var i = 0; i < data.atomChain.length; i++)
		{
			if (currentAtom != i)
			{
				if (getDistance(tempAtom, data.atomChain[i]) <= tempAtom.radius + data.atomChain[i].	radius)
				return ( 1 + i);
			}
		}
		
		for (var i = 0; i < data.atoms.length; i++)
		{
			if ((currentAtom - data.atomChain.length) != i)
			{
				if (getDistance(tempAtom, data.atoms[i]) <= tempAtom.radius + data.atoms[i].radius)
				return ( 1 + i + data.atomChain.length); 
			}
		}
		
		return 0;
	}

	function grabAtom()		// the last atom in chain will grab an atom if it's close to it
	{
		var grabLength = 1;
		
		for (var i = 0; i < data.atoms.length; i++)
		{
			if (getDistance(data.atoms[i], data.atomChain[data.atomChain.length]) < grabLength)
				data.atomChain.push( data.atoms.slice(i,1) );
		}
	}
	
	
	function moveChain(e)
	{
		if( data.directChain )
		{
			data.atomChain[0].x = e.pageX - this.offsetLeft;
			data.atomChain[0].y = e.pageY - this.offsetTop;
		}
	}
	
	canvas.onmouseup = function( e )
	{
		data.directChain = false;
	};
	
	function init()											// initialize canvas
	{
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		canvas.style.border = "5px solid black";
		//canvas.addEventListener('mousemove', mouseMove, false);
		drawBackground( context );
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
		this.atoms = [ new Atom( "C", WIDTH/2, -20, 10 ) ];		// create array with atoms (starts with one atom in it)
		this.atomChain = [ new Atom( " ", WIDTH/2, 200, 10 ) ];		// collected chain starting with a collector
		this.atomTube = new Area( 200, 0, 400, HEIGHT );		// Tube where the atoms is 'raining'
		this.box = new Area( 10, 10, 120, 120 );
		this.running = true;									// Game running?
		this.directChain = false;								// Chain being controlled?
		this.pinX = 0;											// mouse position X
		this.pinY = 0;											// mouse position Y
		this.lazerOffsetBottom = 40;							// distance between bottom and the lazer
	} // end Data();

	// 'Object' that defines an Atom
	function Atom( type, x, y, radius )
	{
		this.name = type;								// name of atom (abbreviation)
		this.x = x;										// position x in space
		this.y = y;									// position y in space
		this.radius = radius;							// radius in pixels
		this.timeCreated = new Date().getTime();		// When this atom was 'created'
		this.color = 'rgb('	+Math.floor(radius*9)+', '
							+Math.floor(255-(radius*9))+', '
							+Math.floor((255*(radius))%255)+')';
		this.velX = 0;									// velocity sideways (magnetics)
		this.falling = true;							// Whether the atom is falling or not
	} // end Atom()
	
	// 'Object' that define an area
	function Area( x, y, width, height )
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	} // end Area()
	
	
	// Draw the static content
	function drawFrame()
	{
		// draw lines visualizing the atomtube
		context.beginPath();
		context.moveTo( data.atomTube.x, data.atomTube.y );
		context.lineTo( data.atomTube.x, data.atomTube.height );
		context.strokeStyle = "rgb( 255, 255, 255 )";
		context.stroke();
		context.moveTo( data.atomTube.x + data.atomTube.width, data.atomTube.y );
		context.lineTo( data.atomTube.x + data.atomTube.width, data.atomTube.y + data.atomTube.height );
		context.strokeStyle = "rgb( 255, 255, 255 )";
		context.stroke();
		context.closePath();
		drawLaser(data.atomTube.x,data.atomTube.height-data.lazerOffsetBottom,data.atomTube.width,3);
		drawBox();
	}
	
	function drawBox()
	{
		context.beginPath();
		context.moveTo( data.box.x, data.box.y );
		context.lineTo( data.box.x, data.box.y + data.box.height );
		context.lineTo( data.box.x+data.box.width, data.box.y+data.box.height );
		context.lineTo( data.box.x+data.box.width, data.box.y );
		context.lineTo( data.box.x, data.box.y );
		context.stroke();
	}
	
	function drawLaser( x, y, width, numInverts )
	{
		var variance = Math.random()*5;
		context.beginPath();
		context.moveTo( x, y );
		//for( i = 0; i < numInverts; i++ )
		//{
		//	context.quadraticCurveTo( x + ( i * width / numInverts * 2 ), y+variance, x + ( i+1 * width / numInverts * 2 ), y );
		//	context.stroke();
		//}
		context.strokeStyle = "rgb( 255, 0, 0 )";
		context.lineWidth = 4;
		context.quadraticCurveTo( x + ( 1 * width / 6 ), y+variance, x + ( 2 * width / 6 ), y );
		context.stroke();
		context.quadraticCurveTo( x + ( 3 * width / 6 ), y-variance, x + ( 4 * width / 6 ), y );
		context.stroke();
		context.quadraticCurveTo( x + ( 5 * width / 6 ), y+variance, x + ( 6 * width / 6 ), y );
		context.stroke();
		context.closePath();
	} // end Area()
		

	// Draw an Atom
	function drawAtom( atom )
	{
		context.beginPath();
		context.arc( atom.x, atom.y, atom.radius, 0, 2*Math.PI, true );
		context.fillStyle = atom.color;//'rgb(255, 255, 0)';
		context.lineWidth = 1;
		context.fill();
		context.fillStyle = 'rgb(0, 0, 0)';
		context.font = "normal "+atom.radius*1.4+"px Verdana";
		if(atom.name.lenght<2){
		context.fillText(atom.name,
						atom.x - (atom.radius*4/5),
						atom.y+(atom.radius/2));
		}else{
		context.fillText(atom.name,
						atom.x - (atom.radius/2),
						atom.y+(atom.radius/2));
		}
		context.closePath();
	} // end drawAtom()
	
	function drawMolecule()
	{
		
	}

	// Create and draw a frame
	function gameLoop()
	{
		if( data.running )
		{
			update();
			render();
		}
	} // end gameLoop()


	// Update data according to last screen
	function update()
	{
		var atomName;
		var atomMass;
		for( i = 0; i < data.atoms.length; i++ )	// for every atom
		{
			atom = data.atoms[i];					// find height
			
			if( atom.y < HEIGHT-data.lazerOffsetBottom-20 )				// if bubbling downwards
			{
				atom.y += 3;						// keep bubbling
				// grabing	//	 data.atomChain.push( data.atoms.pop() );
			}
			else									// if getting close to bottom
				data.atoms.splice( i, 1 );			// remove atom from memory
			
		}
		timeDiff = new Date().getTime() - data.atoms[data.atoms.length - 1].timeCreated;
		if( timeDiff > 750 ){
			var atomIndex = (Math.floor( (Math.random() *  atomListName.length)) );
			atomName = atomListName[atomIndex];
			atomMass = atomListMass[atomIndex]/3 + 15;
			data.atoms[data.atoms.length] = new Atom( 			// create another atom!
					atomName,
					data.atomTube.x + 20 + Math.floor( Math.random() * (data.atomTube.width-40) ), 
					-20, 
					atomMass );
		}
	} // end update()

	// Render a scene
	function render()
	{
		drawBackground();
		drawFrame();
		
		for( i = 0; i < data.atoms.length; i++ )
		{
			drawAtom( data.atoms[i] );
		}
		
		// draw the collected chain
		for( i = 0; i < data.atomChain.length; i++ )
		{
			drawAtom( data.atomChain[i] );
		}
	} // end render() 
} // end AtomicFishing()