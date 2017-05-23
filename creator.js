//*******************************************************************
//NODE MANIPULATION
//*******************************************************************
nodes = [];

class node {
/*
This is a node object. It store the position and edges of a node.
*/
    constructor(xCoord, yCoord) {
        this.xPos = xCoord;
        this.yPos = yCoord;
        this.adjacencies = [];
    }
}

function drawNode(xPos, yPos){
    /*
    Given an (x,y) coordinate, it draws a semitransparent circle on the
    canvas of radius 5 px.
    
    INPUT
    xPos: The x coordinate of the node
    yPos: The y coordinate of the node
    */

    ctx.beginPath();
    //Make the node circle red and thicken the stroke
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;

    ctx.arc(xPos, yPos, 10, 0, 2 * Math.PI);
    ctx.stroke();
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
    
    //The maximum radius at which a point is still in the circle
    var MAX_RADIUS = 10;

    //Check each node and check to see the radius at which the click is from it
    for(i = 0; i<nodes.length; i++){
        //Apply pythagorean theorem
        var radius = Math.sqrt(Math.pow(xPos - nodes[i].xPos, 2) + 
        Math.pow(yPos - nodes[i].yPos, 2));

        //If the radius is less than the maximum radius of the circle then
        //our click is in the node
        if(radius <= MAX_RADIUS){
            
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
