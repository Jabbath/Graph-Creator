# Graph Creator

Graph creator is a tool designed to help graph theorists input graphs from pre-existing images. An example use case for Graph Creator is transcribing a board game such as Scotland Yard into graph form. Inputting an adjacency matrix or list by hand for a large game like Scotland Yard could take hours. Graph Creator provides a point and click way to create such graphs, drastically cutting down on input time.

## Supported Functionality
#### Multiline Adjacency Lists
Graph Creator can output a user made graph as a multi-line adjacency list, as used by [NetworkX](https://networkx.github.io/). 

#### Vertex Position List
Graph Creator can output a JSON file with (x, y) coordinates of each user added vertex.

## Graph Input Options
Graph Creator allows point and click vertex addition and edge addition. Currently, visualization of multiple edges between two vertices is supported. Self loops can be added, however visualization has not been implemented yet. In addition, point and click vertex removal is supported. Removing edges from a vertex in the reverse order in which they were added is supported (undo).

## Installation
To install Graph creator first git clone this repo:

```
git clone https://github.com/Jabbath/Graph-Creator
```

Then, download the latest version of [NW.js (node-webkit)](https://nwjs.io/), and simply drag and drop the files from the repo into the base directory of NW.js. To run the application, run nw.

## Usage
To create a graph from an image, open it from the menu bar. Then, use the toggle buttons to change entry modes (add vertices, remove vertices, ..., etc).

## Contribution
If you have a useful feature to contribute, feel free to make a pull request. Contributions are welcome! For a list of planned features that need implementation, check the issues tab.

## License
Licensed under the MIT license. See license.txt.
