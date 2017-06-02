var cy;

//Prepare the graph to be rendered once we have an image
function renderGraph(img){
    cy = cytoscape({
        'container': $('#container'),
        'style': [{
            'selector': 'edge',
            'style': {
                'line-color': '#ff0000',
                'curve-style': 'bezier',
                'control-point-step-size': '50px'
            }
        }]
    });
    
    //Set our background image
    $('#container').css('background-image', 'url(' + img.src + ')');    

    //Bind our event handlers
    cy.on('tap', 'edge', removeEdge);
    cy.on('tap', 'node', removeNode);
    cy.on('tap', addNode);
    cy.on('tap', 'node', addEdge);
}

