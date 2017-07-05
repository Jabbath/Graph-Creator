var cy;

//Prepare the graph to be rendered once we have an image
function renderGraph(img){
    cy = cytoscape({
        'container': $('#container'),
        'userZoomingEnabled': false,
        'userPanningEnabled': false,
        'style': [{
            'selector': 'edge',
            'style': {
                'line-color': '#3399ff',
                'opacity': 0.7,
                'curve-style': 'bezier',
                'control-point-step-size': '50px',
                'label': '',
                'text-outline-width': 2,
                'text-outline-color': '#ff0000'
            }
        },
        {
            'selector': 'node',
            'style': {
                'border-color': '#ff0000',
                'width': 25,
                'height': 25,
                'background-opacity': 0,
                'border-opacity': 1,
                'border-width': 3,
                'shape': 'ellipse',
                'font-size': 20,
                'label': '',
                'text-outline-color': '#ff0000',
                'text-outline-width': 2
            }
        }]

    });
    
    //Set our background image if it's provided
    if(img != null){
        $('#container').css('background-image', 'url(' + img.src + ')');    
    }

    //Bind our event handlers
    cy.on('tap', 'edge', removeEdge);
    cy.on('tap', 'node', removeNode);
    cy.on('tap', addNode);
    cy.on('tap', 'node', addEdge);

    cy.on('mouseover', 'node', writeLabel);
    cy.on('mouseout', 'node', stopWrite);

    cy.on('mouseover', 'edge', writeWeight);
    cy.on('mouseout', 'edge', stopWriteWeight);
}

