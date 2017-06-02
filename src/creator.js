var selectedNode,
    writing = false;

function writeLabel(evt){
    //Enable writing labels for the node we are hovering over
    selectedNode = evt.target;
    writing = true;
}

function stopWrite(evt){
    //Disable writing labels after we move off the node
    writing = false;
}


$(document).on('keyup', function(key){
    /*
    Listen for when we press a key and change a node's label if
    we are hovering over it.

    INPUT
    key: A jquery keyup event
    */
    if(!writing) return;

    //Detect backspace and otherwise input characters
    if(key.keyCode === 8){
        //Check if our label is already empty
        if(selectedNode.style('label').length === 0) return;
            
        //Remove the last character
        selectedNode.style('label', selectedNode.style('label').slice(0, -1));
    }
    else if(key.keyCode >= 32 && key.keyCode < 127){
        selectedNode.style('label',
        selectedNode.style('label') + String.fromCharCode(key.keyCode).toLowerCase());
    }
});
//************************************************************************
//BASIC GRAPH MANIPULATION
//************************************************************************

var selected  = [];

function addEdge(evt){
    /*
    Takes a cytoscape event, and add an edge if sufficiently many
    nodes have been selected, and we are adding edges.

    INPUT
    evt: A cytoscape event for a node tap
    */
    if(mode !== 'adding edges') return;

    selected.push(evt.target);
    //Check if we have two edges selected and draw an edge

    if(selected.length === 2){
        //Add an edge and draw it
        cy.add({
            group: 'edges',
            data: {
                source: selected[0].id(),
                target: selected[1].id()
            }
        });

        selected = [];
    }
}

function removeEdge(evt){ 
    if(mode !== 'removing edges') return;

    var edge = evt.target;
    cy.remove(edge);
}

function addNode(evt){
    /*
    Given a cytoscape event handler, check if the user clicked on the background
    and add a node there if they did and we are adding nodes.

    INPUT
    evt: A cytoscape tap event handler
    */
    if(mode !== 'adding nodes') return;

    cy.add({
        group: "nodes",
        position: {x: evt.position.x, y: evt.position.y}
    });
}

function removeNode(evt){
    /*
    Given a node click event handler, checks if we are removing nodes
    and removes the node clicked on if we are.

    INPUT
    evt: The event handler for a node click
    */
    if(mode !== 'removing nodes') return;

    var node = evt.target;
    cy.remove(node);
}

//*****************************************************************
//INITIALIZATION
//*****************************************************************

//Get our canvas and draw the map to it
var map;

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

document.getElementById('removeEdges').addEventListener('click',
function(){setMode('removing edges')}, false);
