# Graph Sort

NPM paclage to partially sort nodes on a directed graph. Built to rank data acquired from pairwise comparisons made by humans.

## Justification

People a) get bored and b) are not coherent in their feedback. Graph sort allows us to use transitive dominances, and have cycles in the feedback (a>b>c>a).

## Definitions

A dominance is described in this document as "A>B" which is like saying "A is dominant over B".

If we have three nodes A, B, C and defined dominances of A>B, B>C, A should be ranked the highest followed by B, followed by C.

Ranking is calculated based on the sort order of a node. The sort order of a node is 1 + the number of nodes it dominates, including transitive dominances. In the example above of A>B, B>C, C has a sort order of 1. B has a sort order of 2. A has a sort order of 3.

Ties occur if nodes have the same sort order. This happens either by chance, or if the nodes are part of the same cycle. Eg. if A>B, B>C, C>A then A == B == C.

## Usage

### Create a graph
```Javascript
var g = new graphSort();
```
### Create a node
```Javascript
//node1 will have the value 1
var node1 = new graphNode(1);
```
### Add node to the graph
```Javascript
g.addNode(node1);
```
### Set dominance
Note, setting the dominance automatically adds a node to the graph if it is not already on it.
```Javascript
//create a second node
var node2 = new graphNode(2);
//add it to the graph and set the dominance
g.setDominance(node1,node2);
```
### Sort nodes
```Javascript
//sortNodes returns an array of nodes in sorted order.
var sorted = g.sortNodes();
//print out the sorted nodes.
for(var n in sorted){
    console.log(sorted[n].value,"->", sorted[n].sortOrder);
}
```
### other functions
Documentation coming soon!

See /test/graphSort.test.js for more info.
