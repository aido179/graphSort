/*
*       GRAPH
*/

var GraphSort = function(){
    this.nodes = [];
    this.nodesById = {};
    this.edges = [];
    this.top = {};
    //this should let us know if we need to recalculate sortOrder
    // after a node has been added.
    this.orderGood = false;
    this.visited = [];
    this.sortedNodes = [];
};
GraphSort.prototype.visitNode = function(node){
    this.visited.push(node);
};
GraphSort.prototype.checkNodeExists = function(node){
    var count = 0;
    for(var i in this.nodes){
        if(this.nodes[i].value === node.value){
            count += 1;
        }
    }
    //sanity check
    if(count>1){
        throw("Graph structure error: Contains duplicates.");
    }
    return count === 1;
};
GraphSort.prototype.addNode = function(node){
    if (this.checkNodeExists(node)===false){
        this.nodes.push(node);
        this.nodesById[node.id] = node;
        if(node.getSortOrder() > this.top){
            this.top = node;
        }else{
            this.orderGood = false;
        }
        return true;
    }else{
        return false;
    }
};
GraphSort.prototype.setDominance = function(parent, child){
    this.orderGood = false;

    //do spacetime continuum check here.

    parent.addChild(child);
    if(!this.checkNodeExists(parent)){
        this.addNode(parent);
    }
    if(!this.checkNodeExists(child)){
        this.addNode(child);
    }
    return true;
};

/*
GraphSort.prototype.transitiveReduction = function(parent, child){
    //may not be necessary...
};
*/

GraphSort.prototype.sortNodes = function(parent, child){
    if(this.orderGood){
        return this.sortedNodes;
    }
    //output all nodes in sorted order.
    //using simple linear sort.
    var temp = this.nodes;
    var len     = temp.length,     // number of items in the array
        value,                      // the value currently being compared
        i,                          // index into unsorted section
        j;                          // index into sorted section

    for(var k in temp){
        temp[k].getSortOrder();
    }

    for (i=1; i < len; i++) {
        value = temp[i];
        for (j=i-1; j > -1 && temp[j].sortOrder < value.sortOrder; j--) {
            temp[j+1] = temp[j];
        }
        temp[j+1] = value;
    }
    orderGood = true;
    this.sortedNodes = temp;
    return temp;
};

GraphSort.prototype.getTies = function(){
    if(!this.orderGood){
        this.sortNodes();
    }
    var groupedNodes = [];
    //group all nodes with the same sortOrder into arrays.
    for(var i = 1; i<this.sortedNodes.length;i++){
        if (this.sortedNodes[i].sortOrder === this.sortedNodes[i-1].sortOrder){
            var lastGroup = groupedNodes.length-1;
            if(lastGroup>-1 && groupedNodes[lastGroup][0].sortOrder === this.sortedNodes[i].sortOrder){
                groupedNodes[lastGroup].push(this.sortedNodes[i]);
            }else{
                groupedNodes.push([this.sortedNodes[i-1],this.sortedNodes[i]]);
            }

        }
    }

    //return the array of tie arrays
    return groupedNodes;
};
/*
*       NODE
*/
function GraphNode(graphIn, val){
    this.value = val;
    this.id = getId();
    this.graph = graphIn;
    this.sortOrder = 1;
    this.children = [];
}
GraphNode.prototype.checkChildExists = function(node){
    var count = 0;
    for(var i in this.children){
        if(this.children[i].value === node.value){
            count += 1;
        }
    }
    //sanity check
    if(count>1){
        throw("Node structure error: Contains duplicate children.");
    }
    return count === 1;
};
GraphNode.prototype.addChild = function(child){
    if(!this.checkChildExists(child)){
        this.children.push(child);
        return true;
    }else{
        return false;
    }
};

GraphNode.prototype.isCircular = function(searchNodeIn, currentPathIn, pathsObjIn){
    //do depth first search for yourself.
    var searchNode = searchNodeIn || this;
    var cPath = currentPathIn || [];
    var paths = pathsObjIn || new pathsObj();

    cPath.push(this);

    for(var c in this.children){
        if (this.children[c] === searchNode){
            paths.addPath(cPath);
        }else{
            //slice prevents static array
            this.children[c].isCircular(searchNode, cPath.slice(), paths);
        }
    }

    return paths;
};

GraphNode.prototype.getSortOrder = function(rootIn, localVisitedIn){
    var lVisited = localVisitedIn || [];
    var root = rootIn || this;
    lVisited.push(this);

    for(var child in this.children){
        if(lVisited.indexOf(this.children[child])===-1){
            this.children[child].getSortOrder(root, lVisited);
        }
    }
    var count = lVisited.length;
    root.sortOrder = count;
    return count;
};

function pathsObj(){
    this.paths = [];
}
pathsObj.prototype.addPath = function(pathArray){
    this.paths.push(pathArray);
};
function makeCounter() {
    var i = 0;
    return function() {
        return i++;
    };
}
var getId = makeCounter();

module.exports = {
    Graph: GraphSort,
    Node: GraphNode
};
