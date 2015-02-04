var assert       = require('assert');
var graphSort    = require('../js/graphSort').Graph;
var graphNode    = require('../js/graphSort').Node;


describe('GraphSort', function() {
    describe('#addNode()', function(){
        it('should add a single node to the nodes array, if it does not already exist', function() {
            var g = new graphSort();
            var n = new graphNode(g);
            assert.equal(g.addNode(n), true);
            assert.equal(g.nodes.length, 1);
            assert.equal(g.addNode(n), false);
        });
    });
    describe('#checkNodeExists()',function(){
        it('should return true if a node with the same value is in the graph, false otherwise.', function() {
            var g = new graphSort();
            var n = new graphNode(g, "value");
            assert.equal(g.checkNodeExists(n), false);
            g.addNode(n);
            assert.equal(g.checkNodeExists(n), true);
            var n1 = new graphNode(g, "value");
            assert.equal(g.checkNodeExists(n1), true);
        });
    });
    describe('#setDominance()',function(){
        it('should return true if completed successfully.', function() {
            var g = new graphSort();
            var n = new graphNode(g, "value");
            var n1 = new graphNode(g, "value");
            assert.equal(g.setDominance(n,n1), true);
            //should make sure that the sorted order comes out right...
        });
    });
    //setup test tree
    //        A
    //      /   \
    //     B  -> C
    //   /  \     \
    //  E    D     F
    //   \  /       \
    //     G         H
    /*Predicted Rankings:
    A   7
    B   6
    C   2
    D   1
    E   1
    F   1
    G   0
    H   0
    */
    var g = new graphSort();
    var nA = new graphNode(g, "A");
    var nB = new graphNode(g, "B");
    var nC = new graphNode(g, "C");
    var nD = new graphNode(g, "D");
    var nE = new graphNode(g, "E");
    var nF = new graphNode(g, "F");
    var nG = new graphNode(g, "G");
    var nH = new graphNode(g, "H");
    //dominances in order
    g.setDominance(nA,nB);
    g.setDominance(nA,nC);
    g.setDominance(nB,nC);
    g.setDominance(nB,nD);
    g.setDominance(nB,nE);
    g.setDominance(nC,nF);
    g.setDominance(nE,nG);
    g.setDominance(nD,nG);
    g.setDominance(nF,nH);

    describe('#sortNodes()',function(){
        it('should return the list in sorted order', function() {
            var sorted = g.sortNodes();
            //tests based on predicted rankings...
            assert.equal(sorted.indexOf(nA)<sorted.indexOf(nB), true);
            assert.equal(sorted.indexOf(nB)<sorted.indexOf(nC), true);
            assert.equal(sorted.indexOf(nC)<sorted.indexOf(nD), true);
            assert.equal(sorted.indexOf(nC)<sorted.indexOf(nE), true);
            assert.equal(sorted.indexOf(nC)<sorted.indexOf(nF), true);
            assert.equal(sorted.indexOf(nF)<sorted.indexOf(nG), true);
            assert.equal(sorted.indexOf(nF)<sorted.indexOf(nH), true);
        });
    });
    describe('#getTies()',function(){
        it('should return an array of tied nodes in sub arrays', function() {
            //predicted ties:
            //[D, E, F] with sort order 2
            //[G, H]    with sort order 1
            var tiesArray = g.getTies();
            //test first set of ties
            assert.equal(tiesArray[0].length, 3);
            assert.equal(tiesArray[0][0].sortOrder, 2);
            //test second set of ties
            assert.equal(tiesArray[1].length, 2);
            assert.equal(tiesArray[1][0].sortOrder, 1);
        });
    });
});

describe('GraphNode', function() {
    describe('#isCircular()', function(){
        //A.K.A breaksSpacetimeContinuum()
        //A.K.A isPhilipJFry()
        it('should return one path for a circular pair. A->B->A',function(){
            //test with 2 nodes
            var g = new graphSort();
            var nA = new graphNode(g, "nA");
            var nB = new graphNode(g, "nB");
            g.setDominance(nA,nB);
            g.setDominance(nB,nA);
            var p = nA.isCircular();
            assert.equal(p.paths[0][0]===nA, true);
            assert.equal(p.paths[0][1]===nB, true);
        });
        it('should return one path for a circular triplet. A->B->C->A',function(){
            //test with 3 nodes
            var g = new graphSort();
            var nA = new graphNode(g, "nA");
            var nB = new graphNode(g, "nB");
            var nC = new graphNode(g, "nC");
            g.setDominance(nA,nB);
            g.setDominance(nB,nC);
            g.setDominance(nC,nA);
            var p = nA.isCircular();
            assert.equal(p.paths[0][0]===nA, true);
            assert.equal(p.paths[0][1]===nB, true);
            assert.equal(p.paths[0][2]===nC, true);
        });
        it('should return two paths for a circular quad A->B->D|A->C->D|D->A',function(){
            //test with 3 nodes
            var g = new graphSort();
            var nA = new graphNode(g, "nA");
            var nB = new graphNode(g, "nB");
            var nC = new graphNode(g, "nC");
            var nD = new graphNode(g, "nD");
            g.setDominance(nA,nB);
            g.setDominance(nB,nD);
            g.setDominance(nA,nC);
            g.setDominance(nC,nD);
            g.setDominance(nD,nA);
            var p = nA.isCircular();
            assert.equal(p.paths[0][0]===nA, true);
            assert.equal(p.paths[0][1]===nB, true);
            assert.equal(p.paths[0][2]===nD, true);
            assert.equal(p.paths[1][0]===nA, true);
            assert.equal(p.paths[1][1]===nC, true);
            assert.equal(p.paths[1][2]===nD, true);
        });
        it('should work for a big ass graph. (No Assertions)',function(){
            //test with 3 nodes
            var g = new graphSort();
            var nA = new graphNode(g, "nA");
            var nB = new graphNode(g, "nB");
            var nC = new graphNode(g, "nC");
            var nD = new graphNode(g, "nD");
            var nE = new graphNode(g, "nE");
            var nF = new graphNode(g, "nF");
            var nG = new graphNode(g, "nG");
            var nH = new graphNode(g, "nH");
            var nI = new graphNode(g, "nI");
            var nJ = new graphNode(g, "nJ");
            g.setDominance(nA,nB);
            g.setDominance(nB,nD);
            g.setDominance(nD,nH);
            g.setDominance(nH,nJ);
            g.setDominance(nB,nE);
            g.setDominance(nE,nH);
            g.setDominance(nA,nC);
            g.setDominance(nC,nF);
            g.setDominance(nF,nI);
            g.setDominance(nI,nJ);
            g.setDominance(nC,nG);
            g.setDominance(nG,nI);
            g.setDominance(nJ,nA);
            g.setDominance(nE,nA);
            g.setDominance(nF,nA);
            var p = nA.isCircular();
            //console.log(p.paths);
        });
    });
    describe('#addChild()', function(){
        it('should return true if a new child is added, false if child already existed with same val', function() {
            var g = new graphSort();
            var n = new graphNode(g, "n");
            var n1 = new graphNode(g, "n1");
            assert.equal(n.addChild(n1), true);
            assert.equal(n.addChild(n1), false);
        });
    });
    describe('#getSortOrder()', function(){
        it('should return 1 when the node has no children', function() {
            var g = new graphSort();
            var n = new graphNode(g);
            assert.equal(n.getSortOrder(), 1);
        });

        it('should return 2 when the node has one child with no further children', function() {
            var g = new graphSort();
            var n = new graphNode(g, "n");
            var n1 = new graphNode(g, "n1");
            n.addChild(n1);
            assert.equal(n.getSortOrder(), 2);
        });

        it('should return 4 when the node has 2 children, one with no further children, and one with a single child with no further children', function() {
            /*          n1
            *       n2--+---n3
            *               +----n4
            */
            var g = new graphSort();
            var n1 = new graphNode(g, "n1");
            var n2 = new graphNode(g, "n2");
            var n3 = new graphNode(g, "n3");
            var n4 = new graphNode(g, "n4");
            n1.addChild(n2);
            n1.addChild(n3);
            n3.addChild(n4);
            assert.equal(n1.getSortOrder(), 4);
        });
    });
});
