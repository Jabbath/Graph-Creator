/*
Handles the writing of multiline adjacency lists after the graph is completed.
Also handles general file IO.
*/
var fs = require('fs'),
    pathMod = require('path'),
    dialog = require('nw-dialog');
//**************************************************************************
//WRITE GRAPHS
//**************************************************************************
function makeAdjlist(nodeList){
    /*
    Writes a multiline adjacency list from a list of nodes, as used by networkX.

    INPUT
    nodelist: The list of all nodes in the use made graph

    OUTPUT
    adjlist: A string of the multiline adjacency list
    */

    var adjlist = '';
    
    //Go through each vertex and add it's edges to the adjlist
    for(var i=0; i<nodeList.length; i++){
        var edges = nodeList[i].adjacencies;
        var numEdges = edges.length;
        
        //Add the header
        adjlist = adjlist + i.toString() + ' ' + numEdges.toString() + '\r\n';

        //Add each edge
        for(var k=0; k<numEdges; k++){
           adjlist = adjlist + edges[k].index.toString() + '\r\n';
        }
    }

    return adjlist;
}

function writeGraph(){
    /*
    Writes a multiline adjlist of the user made graph to the specified filename.
    */
    
    dialog.setContext(document);
    dialog.saveFileDialog(function(fileName){
        var adjlist = makeAdjlist(nodes);

        fs.writeFile(fileName, adjlist, function(err){
            if(err) throw err;
        });
    });
}

//**************************************************************************
//WRITE POSITIONS
//**************************************************************************

function makePositionsString(nodeList){
    /*
    Returns a json file as a string with the positions of the nodes with
    coordinates ranging from 0 to 1.

    INPUT
    nodeList: A list of the nodes in the user entered graph

    OUTPUT
    posJSON: A json string of positions in the format {'indexOfNode': [x, y]}
    */

    var posJSON = '{';
    
    for(var i=0; i<nodeList.length; i++){
        posJSON = posJSON + '"' + i.toString() + '": ';
        
        //Scale the coordinates
        var relX = nodeList[i].xPos / map.width,
            relY = nodeList[i].yPos / map.height;

        posJSON = posJSON + '[' + relX.toString() + ', ' + relY.toString() + '], ';
    }

    //Add the last bracket
    posJSON = posJSON + '}';
    return posJSON;
}

function writePositions(){
    /*
    Write a json file of nodes and their respective positions from the user
    made graph to the user specified filename.
    */
    
    dialog.setContext(document);
    dialog.saveFileDialog(function(fileName){
        var positions = makePositionsString(nodes);

        fs.writeFile(fileName, positions, function(err){
            if(err) throw err;
        });
    });
}

//****************************************************************************
//OPEN BACKGROUND IMAGE
//****************************************************************************
function openImage(){
    /*
    Activated when the File>Open dialog in the menubar is clicked.
    Opens a new background image in the canvas.
    */

    //Make a new file input dialog using a hidden input tag.
    dialog.setContext(document);
    dialog.openFileDialog(function(filePath){
        map = new Image();
        map.src =  'file://' + filePath;
        console.log(map.src);

        map.onload = function(){
            canvas.width = map.width;
            canvas.height = map.height;
            reDrawCanvas();
        }
    });
}
