//Make our menu
var menu = new nw.Menu({type: 'menubar'});

var fileSubmenu = new nw.Menu();
fileSubmenu.append(new nw.MenuItem({
    label: 'Open',
    click: openImage
}));

menu.append(new nw.MenuItem({
    label: 'File',
    submenu: fileSubmenu
}));

var graphSubmenu = new nw.Menu();
graphSubmenu.append(new nw.MenuItem({
    label: 'Save as Multiline Adjlist',
    click: writeGraphAdjlist
}));

graphSubmenu.append(new nw.MenuItem({
    label: 'Save as Adjacency Matrix',
    click: writeGraphMatrix
}));

menu.append(new nw.MenuItem({
    label: 'Graph',
    submenu: graphSubmenu
}));

var positionsSubmenu = new nw.Menu();
positionsSubmenu.append(new nw.MenuItem({
    label: 'Save as JSON',
    click: writePositions
}));

menu.append(new nw.MenuItem({
    label: 'Positions',
    submenu: positionsSubmenu
}));

//Display the menu
nw.Window.get().menu = menu;
