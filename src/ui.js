//Handles parts of the user interface like zoom and keyboard shortcuts

//Change the zoom level upon ctrl + mousewheel
const win = nw.Window.get();

window.addEventListener('wheel', function(e){
    if(e.ctrlKey){
        if(e.deltaY > 0){
            win.zoomLevel -= 0.5;
        }
        else{
            win.zoomLevel += 0.5;
        }
    }
});
