function atomicFishing() {
	// constants
	var WIDTH = 800;
	var HEIGHT = 600;

	var canvas = document.getElementById("gameFrame");
	var context = canvas.getContext("2d");

	var points = 0;
	var atomCollection = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var atomListMass = [ 1, 4, 12, 14, 16, 19, 23, 24, 26, 28, 30, 32, 35, 40,
			40 ];
	var atomListName = [ "H", "He", "C", "N", "O", "F", "Na", "Mg", "Al", "Si",
			"P", "S", "Cl", "Ar", "Ca" ];

	init();

	var data = new Data();

	setInterval(function() {
		gameLoop();
	}, 50); // For each 17 ms, start up gameLoop (if finished from last time)
	canvas.addEventListener("mousemove", moveChain, false);// Move chain on
															// mouse movement
															// when control is
															// activated

	canvas.onmousedown = function(e) {
		var pinX = e.pageX - this.offsetLeft;
		var pinY = e.pageY - this.offsetTop;
		if (pinX > data.atomChain[0].x - 10
				&& pinX < data.atomChain[0].x + 10
				&& pinY > data.atomChain[0].y - 10
				&& pinY < data.atomChain[0].y + 10)
			data.directChain = true; // if clicked in or around 'picker',
										// control = true
	};

	function getDistance(atomOne, atomTwo) {
		var xDist, yDist;
	//	alert(atomTwo.x);
		xDist = (atomOne.x - atomTwo.x);
		if (xDist < 0) {
			xDist *= -1;
		}
		yDist = (atomOne.y - atomTwo.y);
		if (yDist < 0) {
			yDist *= -1;
		}

		return (Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)));
	}

	function collisionCheck(currentAtom) {
		for ( var i = 0; i < data.atomChain.length; i++) {
			if (currentAtom != i) {
				if (getDistance(tempAtom, data.atomChain[i]) <= tempAtom.radius
						+ data.atomChain[i].radius)
					return (1 + i);
			}
		}

		for ( var i = 0; i < data.atoms.length; i++) {
			if ((currentAtom - data.atomChain.length) != i) {
				if (getDistance(tempAtom, data.atoms[i]) <= tempAtom.radius
						+ data.atoms[i].radius)
					return (1 + i + data.atomChain.length);
			}
		}

		return 0;
	}

	function moveChain(e) {
		// if( data.directChain )
		// {
		data.atomChain[0].x = e.pageX - this.offsetLeft;
		data.atomChain[0].y = e.pageY - this.offsetTop;
		// }
	}

	canvas.onmouseup = function(e) {
		data.directChain = false;
	};

	function init() // initialize canvas
	{
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		canvas.style.border = "5px solid black";
		// canvas.addEventListener('mousemove', mouseMove, false);
		drawBackground(context);
	} // end init()

	// Draw background
	function drawBackground() {
		var img_background = new Image();
		img_background.src = "background.jpg";
		context.drawImage(img_background, 0, 0);
	} // end drawBackground()

	// 'Object' that holds the data in the game
	function Data() {
		this.atoms = [ new Atom("C", WIDTH / 2, -20, 10) ]; //name,x,y,radius create array with
															// atoms (starts with one atom in it)
		this.atomChain = [ new Atom(" ", WIDTH / 2, 200, 10) ]; // collected chain starting 
															// with a collector
		this.atomTube = new Area(200, 0, 400, HEIGHT); 		// Tube where the atoms is 'raining'
		this.box = new Area(10, 10, 120, 120);				// Molecule-frame
		this.running = true; 								// Game running?
		this.directChain = false; 							// Chain being controlled?
		this.atomMaxRadius = 20;							// maximum radius in an atom
		this.lazerOffsetBottom = 40; // distance between bottom and the lazer
	} // end Data();

	// 'Object' that defines an Atom
	function Atom(type, x, y, radius) {
		this.name = type; // name of atom (abbreviation)
		this.x = x; // position x in space
		this.y = y; // position y in space
		this.radius = radius; // radius in pixels
		this.timeCreated = new Date().getTime(); // When this atom was
													// 'created'
		this.color = 'rgb(' + Math.floor(radius * 9) + ', '
							+ Math.floor(255 - (radius * 9)) + ', '
							+ Math.floor((255 * (radius)) % 255) + ')';
		this.velX = 0; 										// velocity sideways (magnetics)
		this.velY = 3; 										// velocity downwards (gravity)
		this.falling = true; // Whether the atom is falling or not
	} // end Atom()

	// 'Object' that define an area
	function Area(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	} // end Area()

	// Draw the static content
	function drawFrame() {
		// draw lines visualizing the atomtube
		context.beginPath();
		context.moveTo(data.atomTube.x, data.atomTube.y);
		context.lineTo(data.atomTube.x, data.atomTube.height);
		context.strokeStyle = "rgb( 255, 255, 255 )";
		context.stroke();
		context.moveTo(data.atomTube.x + data.atomTube.width, data.atomTube.y);
		context.lineTo(data.atomTube.x + data.atomTube.width, data.atomTube.y
				+ data.atomTube.height);
		context.strokeStyle = "rgb( 255, 255, 255 )";
		context.stroke();
		context.closePath();
		drawLaser(data.atomTube.x, data.atomTube.height
				- data.lazerOffsetBottom, data.atomTube.width, 3);
		drawBox();
	}

	function drawBox() {
		context.beginPath();
		context.moveTo(data.box.x, data.box.y);
		context.lineTo(data.box.x, data.box.y + data.box.height);
		context.lineTo(data.box.x + data.box.width, data.box.y
				+ data.box.height);
		context.lineTo(data.box.x + data.box.width, data.box.y);
		context.lineTo(data.box.x, data.box.y);
		context.stroke();
	}

	function drawLaser(x, y, width, numInverts) {
		var variance = Math.random() * 5;
		context.beginPath();
		context.moveTo(x, y);
		// for( i = 0; i < numInverts; i++ )
		// {
		// context.quadraticCurveTo( x + ( i * width / numInverts * 2 ),
		// y+variance, x + ( i+1 * width / numInverts * 2 ), y );
		// context.stroke();
		// }
		context.strokeStyle = "rgb( 255, 0, 0 )";
		context.lineWidth = 4;
		context.quadraticCurveTo(	x + (1 * width / 6),	y + variance,
									x + (2 * width / 6), 	y			);
		context.stroke();
		context.quadraticCurveTo(	x + (3 * width / 6), 	y - variance, 
									x + (4 * width / 6), 	y			);
		context.stroke();
		context.quadraticCurveTo(	x + (5 * width / 6), 	y + variance,
									x + (6 * width / 6), 	y			);
		context.stroke();
		context.closePath();
	} // end Area()

	// Draw an Atom
	function drawAtom(atom) {
		context.beginPath();
		context.arc(atom.x, atom.y, atom.radius, 0, 2 * Math.PI, true);
		context.fillStyle = atom.color;// 'rgb(255, 255, 0)';
		context.lineWidth = 1;
		context.fill();
		context.fillStyle = 'rgb(0, 0, 0)';
		context.font = "normal " + atom.radius * 1.4 + "px Verdana";
	//	alert(atom.name[1]);
		if (atom.name.length == 2) {
			context.fillText(atom.name, atom.x - (atom.radius * 9 / 10), atom.y
					+ (atom.radius / 2));
		} else {
			context.fillText(atom.name, atom.x - (atom.radius / 2), atom.y
					+ (atom.radius / 2));
		}
		context.closePath();
	} // end drawAtom()

	function drawMolecule() {

	}

	// Create and draw a frame
	function gameLoop() {
		if (data.running) {
			update();
			render();
		}
	} // end gameLoop()

	// Update data according to last screen
	function update() {
		var atomName;
		var atomMass;
		
		// For every free atom
		for (i = 0; i < data.atoms.length; i++)
		{
			updateAtomsCondition( data.atoms[i] );			// do test-conditions on an atom	
		}
		
		// For every collected atom in the chain
		updateAtomChain();								// do test-conditions on atoms in the chain
		
		// Eventually spawning of new atoms
		atomSpawn();										// conditional spawn of atom
		
	} // end update()
	
	function updateAtomsCondition( atom )			// in update() do here the testings on an atom
	{
			atomTubeMaxLimitY = data.atomTube.y + data.atomTube.height - data.lazerOffsetBottom - data.atomMaxRadius;
			if (atom.y < atomTubeMaxLimitY) // if bubbling downwards
			{
				atom.x += atom.velX; 				// keep bubbling
				atom.y += atom.velY;
				
				var distance = getDistance(data.atoms[i], data.atomChain[data.atomChain.length - 1]);
				var limit = data.atoms[i].radius + data.atomChain[data.atomChain.length - 1].radius;
				if ( distance <= limit )				
				{
					looseAtom = data.atoms.splice(i, 1);
					data.atomChain.push( looseAtom[0] );
				}

			} else {						// if getting close to bottom
				data.atoms.splice(i, 1);	// remove atom from memory
			}
			
			atomTubeMinLimitX = data.atomTube.x + atom.radius;
			if ( atom.x < atomTubeMinLimitX ) {
				atom.x = atomTubeMinLimitX+2;
				atom.velX = -(atom.velX * 0.5);
			}
			
			atomTubeMaxLimitX = data.atomTube.x + data.atomTube.width - atom.radius;
			if (atom.x > atomTubeMaxLimitX) {
				atom.x = atomTubeMaxLimitX-2;
				atom.velX = -(atom.velX * 0.5);
			}
			
	} // end updateAtomsCondition()
	
	function updateAtomChain()
	{
		atomTubeMaxLimitY = data.atomTube.y + data.atomTube.height - data.lazerOffsetBottom - data.atomMaxRadius;
		for (var g = 1; g < data.atomChain.length;g++){	
			
			atom = data.atomChain[g];
			if(atom.velX<10&&atom.velX>-5)
			{
				atom.velX -= (atom.x - data.atomChain[g-1].x) * 0.1;
			}
			if(atom.velY<10&&atom.velY>-5)
			{
				atom.velY -= (atom.y - data.atomChain[g-1].y) * 0.1;
				atom.velY +=2;
			}
			
			//data.atomChain[g].velX/(5*g);
			atom.velX -= atom.velX / 3;
			atom.velY -= atom.velY / 3;

			atom.x += atom.velX;
			atom.y += atom.velY;
			
			if( atom.y > atomTubeMaxLimitY )
			{
				if( atom.name != " " )
				{
					for( h = g; h < data.atomChain.length; h++ ) 
					{
						var releaseAtom = data.atomChain.splice(h,1);
						data.atoms.push( releaseAtom[0] );
					}
				} // end if
			} // end for
		} // end for( each atom )
		
		// calculate highest y-value for last atom
		//// while the last atom is below, cut away that atom
		//while( data.atomChain[ data.atomChain.length - 1 ].y > atomTubeMaxLimitY )
		//{
		//	data.atomChain.pop();
		//}

	} // end updateAtomChain()
	
	function atomSpawn()					// Spawn a new atom if conditions are met
	{
		durationSinceCreation = new Date().getTime() - data.atoms[data.atoms.length - 1].timeCreated;
		if (durationSinceCreation > 1750-points) {
			var atomIndex = Math.floor( (Math.random() * atomListName.length) );
			atomName = atomListName[atomIndex];				// name: like C (carbon), H (hydrogen)
			atomMass = atomListMass[atomIndex] / 3 + 15;	// equivalent to radius
			atomX = data.atomTube.x	+ atomMass 
						+ Math.floor( Math.random() * (data.atomTube.width - 2 * atomMass) );
			data.atoms[data.atoms.length] = new Atom( 		// create another atom!
													atomName,
													atomX, 
													-atomMass,	// - radius as y (spawn right before atomTube)
													atomMass);	// radius
		}
	} // end atomSpawn()

	// Render a scene
	function render() {
		drawBackground();
		drawFrame();

		// Draw free Atoms
		for (i = 0; i < data.atoms.length; i++) {
			drawAtom(data.atoms[i]);
		}

		// draw the collected chain
		for (i = 0; i < data.atomChain.length; i++) {
			drawAtom(data.atomChain[i]);
		}
	} // end render()
} // end AtomicFishing()
