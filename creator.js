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
    ctx.arc(xPos, yPos, 10, 0, 2 * Math.PI);
    ctx.stroke();
}

function addNode(e){
    /*
    Records the position of each mouseclick and adds a node there.
    
    INPUT
    e: The event handler for the onclick event
    */

    var xPos = e.clientX,
        yPos = e.clientY;    
    
    //When the user clicks on the graph, add a node
    nodes.push(new node(xPos, yPos));

    //Draw a red dot at the position of the new node
    drawNode(xPos, yPos);
}


//INITIALIZATION
//Get our canvas and draw the map to it
var canvas  = document.getElementById('cytoBkg');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var map = new Image();
map.src = 'maps/map.jpg';

map.onload = function() {
    canvas.width = map.width
    canvas.height = map.height
    ctx.drawImage(map, 0, 0);
}


canvas.addEventListener('click', addNode, false);
