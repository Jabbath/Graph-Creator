//*******************************************************************
//UTILITY
//*******************************************************************
function arrayEqual(array1, array2){
    /*
    Checks if array1 is the same array as array 2.

    INPUTS
    array1: The first array
    array2: The second array

    OUTPUT
    equal: Boolean value on whether the arrays are equal
    */
    
    var equal = true;

    //If the dimensions of the array are mismatched they aren't equal
    if(array1.length !== array2.length){
        equal = false;
        return equal;
    }

    for(var i = 0; i < array1.length; i++){
        if(array1[i] !== array2[i]){
            equal = false;
            return equal;
        }
    }

    return equal;
}

function midPoint(x1, x2){
    /*
    Given numbers x1, and x2, calculates the midpoint between them.

    INPUT
    x1: A real number
    x2: A real number

    OUTPUT
    mid: A real number exactly inbetween x1 and x2
    */
    
    var mid = Math.min(x1, x2) + Math.abs(x2 - x1)/2;
    return mid;
}

function pointDistance(xPos1, yPos1, xPos2, yPos2){
    /*
    Calculate the distance between points with coordinates (xPos1, yPos1)
    and (xPos2, yPos2).

    INPUT
    xPos1: A real number x coordinate for the first point
    yPos1: A real number y coordinate for the first point 
    xPos1: A real number x coordinate for the second point
    yPos1: A real number y coordinate for the second point

    OUTPUT
    distance: The distance between the points calculated with pythagorean theorem
    */

    var distance = Math.sqrt(Math.pow(xPos2 - xPos1, 2) + Math.pow(yPos2 - yPos1, 2));
    return distance;
}

//*******************************************************************
//EDGE TYPE DETECTION
//*******************************************************************

function getNumOfType(type, node1Ind, node2Ind){
    /*
    Given an input of two node indices, it calculates the number of edges of 
    type type between them.

    INPUTS
    type: The integer value of the edge type we are looking for
    node1Ind: The index of the first node
    node2Ind: The index of the second node

    OUTPUTS
    numType: An integer value indicating the number of edges of the type.
    For DiGraphs this will be the greatest of the two numbers for each graph.
    */

    var numType = 0;
    var numNode1 = 0, numNode2 = 0;
    var node1Edges = nodes[node1Ind].adjacencies, 
    node2Edges = nodes[node2Ind].adjacencies;

    //Get the count of edges between node1 and node2 of our type (each direction)
    for(var i = 0; i < node1Edges.length; i++){
        if(node1Edges[i].index === node2Ind && node1Edges[i].type === type){
            numNode1++;
        }
    }

    for(var i = 0; i < node2Edges.length; i++){
        if(node2Edges[i].index === node1Ind && node2Edges[i].type === type){
            numNode2++;
        }
    }

    numType = Math.max(numNode1, numNode2);
    return numType;
    
}

function getEdgeType(node1Ind, node2Ind){
    /*
    Given two nodes as input, returns the next edge type that should be drawn.
    The type is calculated for each node and the least of the two types will be used.
    Type 0: A line.
    Type n, n>0: An ellipse of horizontal radius n times greater than the base ellipse.

    INPUTS
    node1Ind: The first node.
    node2Ind: The second node.

    OUTPUT
    edgeType: An integer value for edge type as described above.
    */
    
    //The maximum number of edges of type n
    const LIMn = 1;
    
    var typeFound = false;
    var n = 0;

    while(!typeFound){
        if(getNumOfType(n, node1Ind, node2Ind) < LIMn){
            typeFound = true;
            return n;
        }

        n++;
    }
}


//*******************************************************************
//NODE MANIPULATION
//*******************************************************************
var nodes = [];

class node {
/*
This is a node object. It store the position and edges of a node.
*/
    constructor(xCoord, yCoord) {
        this.xPos = xCoord;
        this.yPos = yCoord;
        this.adjacencies = [];
    }

    //Checks if an (x, y) coordinate is in the drawn node
    inNode(xPos, yPos){
        const MAX_RADIUS = 10;
        
        //Calculate the radius of the click from the circle's center
        var radius = Math.sqrt(Math.pow(xPos - this.xPos, 2) + 
        Math.pow(yPos - this.yPos, 2));

        if(radius <= MAX_RADIUS){
            return true;
        }
        else{
            return false;
        }
    }
}

function drawNode(xPos, yPos, color){
    /*
    Given an (x,y) coordinate, it draws a semitransparent circle on the
    canvas of radius 5 px.
    
    INPUT
    xPos: The x coordinate of the node
    yPos: The y coordinate of the node
    color [optional]: An optional hex string specifying the color of the node.
    Defaults to #FF0000 (red).
    */

    ctx.beginPath();
    //Make the node circle red or the user given color and thicken the stroke
    ctx.strokeStyle = '#FF0000';
    if(color !== undefined) ctx.strokeStyle = color;

    ctx.lineWidth = 3;

    ctx.arc(xPos, yPos, 10, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawEdge(node1, node2, type){
    /*
    Takes an input of two node objects and draws an edge between them.

    INPUT
    node1: The first node
    node2: The second node
    */

    ctx.beginPath();

    //Make edges blue, 3 thick, and 0.45 transparent
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.45)';
    ctx.lineWidth = 3;

    //A type of 0 is a line edge
    if(type === 0){
        ctx.moveTo(node1.xPos, node1.yPos);
        ctx.lineTo(node2.xPos, node2.yPos);
    }
    //A type of n > 0 is a ellipse edge
    else{
        //Specify the arguments from https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D/ellipse
        var x = midPoint(node1.xPos, node2.xPos),
            y = midPoint(node1.yPos, node2.yPos);
        
        var radiusX = pointDistance(node1.xPos, node1.yPos, node2.xPos, node2.yPos) / 2 ;
        //We want the y radius to be a multiple of the type and thinner than y for small types
        var radiusY = radiusX/4 * type;
        
        //We want to draw the first ellipse above and the second below
        var rotation = Math.PI - Math.asin(Math.abs(node2.yPos - node1.yPos)/(radiusX * 2));

        ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI);
    }

    ctx.stroke();

    //Redraw the nodes as red to show that edge adding has finished
    drawNode(node1.xPos, node1.yPos);
    drawNode(node2.xPos, node2.yPos);
}

function reDrawCanvas(){
    /*
    Redraws the canvas, along with all the nodes and the background image.
    */

    ctx.drawImage(map, 0, 0);
    
    //Keep a record of each edge we draw so that we don't draw twice
    var drawnEdges = [];

    //Draw each node and it's edges
    for(var i = 0; i < nodes.length; i++){
        drawNode(nodes[i].xPos, nodes[i].yPos);
        
        for(var j = 0; j < nodes[i].adjacencies.length; j++){
            var indexNode2 = nodes[i].adjacencies[j].index;
            var edgeType = nodes[i].adjacencies[j].type;
            var edgeDrawn = false;

            //Go through our drawn edges array and see if this edge has been drawn
            for(var k = 0; k < drawnEdges.length; k++){
                if(arrayEqual(drawnEdges[k], [i, indexNode2, edgeType]) 
                || arrayEqual(drawnEdges[k],  [indexNode2, i, edgeType])){
                    edgeDrawn = true;
                    break;
                }
            }

            if(!edgeDrawn){
                //If digraphs are implemented this line will have to be more flexible about types
                drawEdge(nodes[i], nodes[indexNode2], nodes[i].adjacencies[j].type);
                drawnEdges.push([i,indexNode2, edgeType]);
            }
        }
    }
}

var selected  = [];

function addEdge(xPos, yPos){
    /*
    Takes an (xPos, yPos) coordinate. The function checks whether two nodes have been
    'selected', and then adds an edge between them.

    INPUT
    xPos: The x coordinate of the user's click when selecting a node
    yPos: The y coordinate of the user's click when selecting a node
    */

    //Find which node the user has selected with his click and redraw it
    for(var i = nodes.length - 1; i >= 0; i--){
        if(nodes[i].inNode(xPos, yPos)){

            //Add a new selected node and draw it on the screen in green
            selected.push(i);
            drawNode(nodes[i].xPos, nodes[i].yPos, '#66ff99');
            break;
        }
    }

    //Check if we have two edges selected and draw an edge

    if(selected.length === 2){
        //Add an edge and draw it

        var node1Ind = selected[0],
            node2Ind = selected[1];
        
        var edgeType = getEdgeType(node1Ind, node2Ind);
        
        nodes[node1Ind].adjacencies.push({'index': node2Ind, 'weight': 1, 'type': edgeType});
        nodes[node2Ind].adjacencies.push({'index': node1Ind, 'weight': 1, 'type': edgeType});

        drawEdge(nodes[node1Ind], nodes[node2Ind], edgeType);
        selected = [];
    }
}

function addNode(xPos, yPos){
    /*
    Given an (xPos, yPos) coordinate, adds a new node there.

    INPUT
    xPos: The x position of the node
    yPos: The y position of the node
    */

    //When the user clicks on the graph, add a node
    nodes.push(new node(xPos, yPos));

    //Draw a red dot at the position of the new node
    drawNode(xPos, yPos);

}

function updateAdjacencies(removedIndex){
    /*
    Updates the adjacencies of each node to counteract the removal of a node.

    INPUT
    removedIndex: The index of the node we are about to remove.
    */

    //Remove all adjacencies with the node about to be removed
    for(var i = 0; i < nodes.length; i++){
        var count = 0;

        while(count < nodes[i].adjacencies.length){
            //Check if the removed node is adjacent and remove it if it is
            if(nodes[i].adjacencies[count].index === removedIndex){
                nodes[i].adjacencies.splice(count, 1);
                continue;
            }

            count++;
        }
    }

    //Check all other adjacencies and decrement them if they are past the removed index
    for(var i = 0; i < nodes.length; i++){
        for(var j = 0; j < nodes[i].adjacencies.length; j++){
            if(nodes[i].adjacencies[j].index > removedIndex){
                nodes[i].adjacencies[j].index--;
            }
        }
    }
}

function removeNode(xPos, yPos){
    /*
    Given an (xPos, yPos) coordinate, removes the first corresponding to the
    coordinates.

    INPUT:
    xPos: The x position of the node
    yPos: The y position of the node
    */

    //Check each node and check to see the radius at which the click is from it
    for(var i = nodes.length - 1; i>=0; i--){
        //If the radius is less than the maximum radius of the circle then
        //our click is in the node
        if(nodes[i].inNode(xPos, yPos)){
            
            //Remove the entry from the node array and clear it's circle
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateAdjacencies(i);
            nodes.splice(i, 1);
            reDrawCanvas();
            return;
        }
    }
}

//*************************************************************************
//CANVAS EVENT HANDLERS
//*************************************************************************

function canvasClick(e){
    /*
    Records the position of each mouseclick and runs the function determined
    by the current mode.
    
    INPUT
    e: The event object for the onclick event
    */

    var xPos = e.pageX,
        yPos = e.pageY;
    
    //We want to check which input mode we are in
    switch(mode){
        case 'adding nodes':
            addNode(xPos, yPos);
            break;

        case 'removing nodes':
            removeNode(xPos, yPos);
            break;
        
        case 'adding edges':
            addEdge(xPos, yPos);
            break;

        default:
            throw new Error('Invalid input mode!');
    } 
}

//*****************************************************************
//INITIALIZATION
//*****************************************************************

//Get our canvas and draw the map to it
var canvas  = document.getElementById('cytoBkg');
var ctx = canvas.getContext('2d');

var map = new Image();
map.src = 'maps/map.jpg';

map.onload = function() {
    canvas.width = map.width;
    canvas.height = map.height;
    reDrawCanvas();
}

//Set which input mode we will start with
var mode = 'adding nodes';

function setMode(modeType){
    /*
    Sets the current input mode, and updates the status indicator.

    INPUT
    modeType: A string with the new mode
    */

    mode = modeType;

    //Update the status div
    var stat = document.getElementById('status');
    stat.innerHTML = 'Now ' + modeType;
}

//Add listeners so the buttons change the modes
document.getElementById('addNode').addEventListener('click', 
function(){setMode('adding nodes')}, false);

document.getElementById('removeNode').addEventListener('click',
function(){setMode('removing nodes')}, false);

document.getElementById('addEdges').addEventListener('click',
function(){setMode('adding edges')}, false);

canvas.addEventListener('click', canvasClick, false);
