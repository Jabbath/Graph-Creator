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
        var radius = Math.sqrt(Math.pow(xPos - nodes[i].xPos, 2) + 
        Math.pow(yPos - nodes[i].yPos, 2));

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

function drawEdge(node1, node2){
    /*
    Takes an input of two node objects and draws an edge between them.

    INPUT
    node1: The first node
    node2: The second node
    */

    ctx.beginPath();

    //Make edges blue and thick
    ctx.strokeStyle = '#0000ff';
    ctx.lineWidth = 3;

    ctx.moveTo(node1.xPos, node1.yPos);
    ctx.lineTo(node2.xPos, node2.yPos);
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

    for(i = 0; i < nodes.length; i++){
        drawNode(nodes[i].xPos, nodes[i].yPos);
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
    for(i = nodes.length - 1; i >= 0; i--){
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

        nodes[node1Ind].adjacencies.push({'index': node2Ind, 'weight': 1});
        nodes[node2Ind].adjacencies.push({'index': node1Ind, 'weight': 1});

        drawEdge(nodes[node1Ind], nodes[node2Ind]);
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

function removeNode(xPos, yPos){
    /*
    Given an (xPos, yPos) coordinate, removes the first corresponding to the
    coordinates.

    INPUT:
    xPos: The x position of the node
    yPos: The y position of the node
    */

    //Check each node and check to see the radius at which the click is from it
    for(i = nodes.length - 1; i>=0; i--){
        //If the radius is less than the maximum radius of the circle then
        //our click is in the node
        if(nodes[i].inNode(xPos, yPos)){
            
            //Remove the entry from the node array and clear it's circle
            ctx.clearRect(nodes[i].xPos, nodes[i].yPos, 20, 20);
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

    var xPos = e.clientX,
        yPos = e.clientY;
    
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
