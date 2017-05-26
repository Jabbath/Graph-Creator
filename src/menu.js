//Make our menu
var menu = new nw.Menu({type: 'menubar'});

var submenu = new nw.Menu();
submenu.append(new nw.MenuItem({
    label: 'Open',
    click: openImage
}));

menu.append(new nw.MenuItem({
    label: 'File',
    submenu: submenu
}));

//Display the menu
nw.Window.get().menu = menu;
