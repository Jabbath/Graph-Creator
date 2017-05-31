sigma.renderers.def = sigma.renderers.canvas;

var s;

//Prepare the graph to be rendered once we have an image
function renderGraph(img){

    console.log(img);
    s = new sigma({
       'container': 'container',
        'settings': {
            'autoRescale': false,
            'canvasWidth': 1080,
            'canvasHeight': 720,
            'backgroundImg': img,
			'enableCamera': false
        }
    });
    
    s.refresh();

    //Add an event listener for functionality in removing/adding
    document.getElementsByClassName('sigma-mouse')[0].addEventListener('click',
    canvasClick, false);
}

