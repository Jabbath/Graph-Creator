/*
Handles the writing of multiline adjacency lists after the graph is completed.
Also handles general file IO.
*/
var fs = require('fs'),
    dialog = require('nw-dialog');
//**************************************************************************
//WRITE GRAPHS
//**************************************************************************
function checkWeighted(){
    /*
    Goes through each edge in the graph and checks if weight is defined.

    OUTPUT
    weighted: Boolean value for whether any edges are weighted
    */

    var edges = cy.edges(),
        weighted = false;
    
    //Check each edge for a weight
    for(var i=0; i<edges.length; i++){
        if(edges[i].style('label') !== ''){
            weighted = true;
        }
    }

    return weighted;
}

function makeAdjlist(nodeList){
    /*
    Writes a multiline adjacency list from a list of nodes, as used by networkX.

    INPUT
    nodelist: The list of all nodes in the use made graph

    OUTPUT
    adjlist: A string of the multiline adjacency list
    */
    var weighted = checkWeighted();
    var adjlist = '';
    
    //Go through each vertex and add it's edges to the adjlist
    for(var i = 0; i < nodeList.length; i++){

        //Get all the edges that have a target from our current node
        var edges = nodeList[i].edgesTo(nodeList);
        var numEdges = edges.length;
        
        //Check if the user has made a label
        if(nodeList[i].style('label') !== ''){
            //Add the header
            adjlist = adjlist + nodeList[i].style('label') + ' ' + numEdges.toString() + '\r\n';
        }
        else{
            adjlist = adjlist + nodeList[i].data('id') + ' ' + numEdges.toString() + '\r\n';
        }

        //Add each edge
        for(var k=0; k<numEdges; k++){


            var targetLabel = cy.getElementById(edges[k].data('target')).style('label');

            if(targetLabel !== ''){
                adjlist = adjlist + targetLabel;
            }
            else{
                adjlist = adjlist + edges[k].data('target');
            }
            

            //If we are weighted get a weight and write it
            if(weighted){
                var label = edges[k].style('label');

                if(label !== ''){
                    weight = label;
                }
                else{
                    weight = '1';
                }

                adjlist = adjlist + ' {"weight": ' + weight + '}';
            }

            adjlist = adjlist + '\r\n';
        }
    }

    return adjlist;
}

function writeGraphAdjlist(){
    /*
    Writes a multiline adjlist of the user made graph to the specified filename.
    */
    
    dialog.setContext(document);
    dialog.saveFileDialog(function(fileName){
        var adjlist = makeAdjlist(cy.nodes());

        fs.writeFile(fileName, adjlist, function(err){
            if(err) throw err;
        });
    });
}

function getIndexOf(id){
    /*
    Given the id of a node, finds it's index in cy.nodes().

    INPUT
    id: The id of the node in question.

    OUTPUT
    index: The index of the node in question
    */
    var nodes = cy.nodes();

    for(var i=0; i < nodes.length; i++){
        if(nodes[i].id() === id){
            return i;
        }
    }
}

function makeMatrix(nodeList){
    /*
    Given a list of nodes in a graph, creates an adjacency matrix.
    Note that the dimensions of the matrix are the first line of the file
    and are formatted n,n.

    INPUT
    nodeList: A list of nodes in the user's graph

    OUTPUT
    matrix: A string with the first line being the dimensions of a matrix,
    and then a jagged array to represent the matrix.
    */
    
    //Check if the user has specified any weights in the graph
    var matrix = nodeList.length.toString() + ',' + nodeList.length.toString()
    + '\r\n';
    matrix = matrix + '[';

    for(var i=0; i<nodeList.length; i++){
        var edges = nodeList[i].connectedEdges();

        //Define our row and fill it with zeros
        var matrixRow = new Array(nodeList.length);
        matrixRow.fill(0);
        
        //Increment every index which has an edge by one
        for(var j=0; j<edges.length; j++){
            if(edges[j].data('target') === nodeList[i].id()){
                matrixRow[getIndexOf(edges[j].data('source'))]++;
            }
            else{
                matrixRow[getIndexOf(edges[j].data('target'))]++;
            }
        }

        matrix = matrix + '[' + matrixRow.toString() + ']' + ',\r\n';
    }
    
    //Remove the last ',\r\n'
    matrix = matrix.split(',\r\n');
    matrix.pop();
    matrix = matrix.join(',\r\n');

    matrix = matrix + ']';

    return matrix;
}

function writeGraphMatrix(){
    /*
    Writes an adjacency matrix for the usermade graph to the specified filename.
    */

    dialog.setContext(document);
    dialog.saveFileDialog(function(fileName){
        var matrixFile = makeMatrix(cy.nodes());

        fs.writeFile(fileName, matrixFile, function(err){
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
        if(nodeList[i].style('label') !== ''){
            posJSON = posJSON + '"' + nodeList[i].style('label') + '": ';
        }
        else{
            posJSON = posJSON + '"' + nodeList[i].data('id') + '": ';
        }
        //Scale the coordinates (The y axis should be 0 - 1 from the bottom hence the 1 -)
        var relX = nodeList[i].position().x / 1080,
            relY = 1 - nodeList[i].position().y / 720;
        
        //Make sure the last entry doesn't have a comma
        if(i < nodeList.length - 1){
            posJSON = posJSON + '[' + relX.toString() + ', ' + relY.toString() + '], ';
        }
        else{
            posJSON = posJSON + '[' + relX.toString() + ', ' + relY.toString() + ']';
        }
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
        var positions = makePositionsString(cy.nodes());

        fs.writeFile(fileName, positions, function(err){
            if(err) throw err;
        });
    });
}
//**************************************************************************
//OPEN POSITIONS
//**************************************************************************
function parsePositions(posData){
    /*
    Given a json positions file, reads it and applies the positions to
    the nodes in the graph.

    INPUT
    posData: The positions of the nodes in the graph
    */

    var positions = JSON.parse(posData);
    
    //Go through each nodes position and assign it
    for(key in positions){
        cy.getElementById(key).position('x', 1080 * positions[key][0]);

        //We have to adjust the y positions as they're inverted when we write them
        cy.getElementById(key).position('y', 720 *  (positions[key][1] - 1) * -1);
    }
}


function openPositions(){
    /*
    Opens a JSON  form positions file and loads it into cytoscape.
    */

    dialog.setContext(document);
    
    //Open a multiline adjlist and add the nodes
    dialog.openFileDialog(function(filePath){
        fs.readFile(filePath, function (err, data){ 
            if(err) throw err;
            
            parsePositions(data.toString());
        });
    });
}

//***************************************************************************
//OPEN GRAPHS
//***************************************************************************
function parseGraph(graph){
    /*
    Given input of a multiline adjlist as a string,
    parses it and creates the cytoscape graph.

    INPUT
    graph: A string of a multiline adjlist
    */

    //Remove any existing graph
    cy.elements().remove();
    
    var lines = graph.split('\n');
    if(lines.length === 0) throw new Error('Could not open graph: no data');

    var currentLine = 0;
    
    //Read each of the adjacencies for a source node and add them
    while(currentLine < lines.length - 1){
        
        //Read the first node and add it
        var sourceNode = lines[currentLine].split(' ')[0];
        var degree = parseInt(lines[currentLine].split(' ')[1]);
        
        //If the source node already exists this will make an error
        try{   
            cy.add({
                group: 'nodes',
                data: {
                    id: sourceNode
                },
                style: {
                    label: sourceNode
                }
            });
        }catch(err){}

        currentLine++;

        edges = lines.slice(currentLine, currentLine + degree);
        
        //Add each edge if it doesn't exist already
        for(var i=0; i<edges.length; i++){
            //Split up the edge destination and properties
            var sepString = edges[i].split('{');
            
            //Get the target node and remove the extra space if there was a bracket
            if(sepString.length === 2){
                var targetNode = sepString[0].slice(0, -1);
            }
            else{
                var targetNode = sepString[0];
            }

            
            var weight = '';
            //Get the properties properties
            if(sepString.length === 2){
                weight = JSON.parse('{' + sepString[1]).weight.toString();
            }
            
            //Add the target node in case it doesn't exist
            try{    
                cy.add({
                    group: 'nodes',
                    data: {
                        id: targetNode
                    },
                    style: {
                        label: targetNode
                    }
                });
            }catch(err){}
            
            //Add the edge
            cy.add({
                group: 'edges',
                data: {
                    source: sourceNode,
                    target: targetNode
                },
                style: {
                    label: weight
                }
            });
        }

        currentLine+= degree;
    }    
}

function openGraph(){
    /*
    Opens a multiline adjlist form graph file and loads it into cytoscape.
    */

    dialog.setContext(document);
    
    //Open a multiline adjlist and add the nodes
    dialog.openFileDialog(function(filePath){
        fs.readFile(filePath, function (err, data){ 
            if(err) throw err;
            
            parseGraph(data.toString());
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

        map.onload = function(){
            renderGraph(map);
        }
    });
}
