// A custom layout that shows the two families related to a person's parents
class GenogramLayout extends go.LayeredDigraphLayout {
        constructor(obj) {
            super(obj);
            this.initializeOption = go.LayeredDigraphInit.DepthFirstIn;
            this.spouseSpacing = 30; // minimum space between spouses
            this.isRouting = false;
        }

        makeNetwork(coll) {
            // generate LayoutEdges for each parent-child Link
            const net = this.createNetwork();
            if (coll instanceof go.Diagram) {
                this.add(net, coll.nodes, true);
                this.add(net, coll.links, true);
            } else if (coll instanceof go.Group) {
                this.add(net, coll.memberParts, false);
            } else if (coll.iterator) {
                this.add(net, coll.iterator, false);
            }
            return net;
        }

        // internal method for creating LayeredDigraphNetwork where husband/wife pairs are represented
        // by a single LayeredDigraphVertex corresponding to the label Node on the marriage Link
        add(net, coll, nonmemberonly) {
            const horiz = this.direction == 0.0 || this.direction == 180.0;
            const multiSpousePeople = new go.Set();
            // consider all Nodes in the given collection
            const it = coll.iterator;
            while (it.next()) {
                const node = it.value;
                if (!(node instanceof go.Node) || !node.data) continue;
                if (!node.isLayoutPositioned || !node.isVisible()) continue;
                if (nonmemberonly && node.containingGroup !== null) continue;
                // if it's an unmarried Node, or if it's a Link Label Node, create a LayoutVertex for it
                if (node.isLinkLabel) {
                    // get marriage Link
                    const link = node.labeledLink;
                    if (link.category === "Marriage") {
                        const spouseA = link.fromNode;
                        const spouseB = link.toNode;
                        // create vertex representing both husband and wife
                        const vertex = net.addNode(node);
                        // now define the vertex size to be big enough to hold both spouses
                        if (horiz) {
                            vertex.height = spouseA.actualBounds.height + this.spouseSpacing + spouseB.actualBounds.height;
                            vertex.width = Math.max(spouseA.actualBounds.width, spouseB.actualBounds.width);
                            vertex.focus = new go.Point(vertex.width / 2, spouseA.actualBounds.height + this.spouseSpacing / 2);
                        } else {
                            vertex.width = spouseA.actualBounds.width + this.spouseSpacing + spouseB.actualBounds.width;
                            vertex.height = Math.max(spouseA.actualBounds.height, spouseB.actualBounds.height);
                            vertex.focus = new go.Point(spouseA.actualBounds.width + this.spouseSpacing / 2, vertex.height / 2);
                        }
                    }
                } else {
                    // don't add a vertex for any married person!
                    // instead, code above adds label node for marriage link
                    // assume a marriage Link has a label Node
                    let marriages = 0;
                    node.linksConnected.each(l => {
                        if (l.category === "Marriage") marriages++;
                    });
                    if (marriages === 0) {
                        net.addNode(node);
                    } else if (marriages > 1) {
                        multiSpousePeople.add(node);
                    }
                }
            }
            // now do all Links
            it.reset();
            while (it.next()) {
                const link = it.value;
                if (!(link instanceof go.Link)) continue;
                if (!link.isLayoutPositioned || !link.isVisible()) continue;
                if (nonmemberonly && link.containingGroup !== null) continue;
                // if it's a parent-child link, add a LayoutEdge for it
                if (link.category === "" && link.data) {
                    const parent = net.findVertex(link.fromNode); // should be a label node
                    const child = net.findVertex(link.toNode);
                    if (child !== null) { // an unmarried child
                        net.linkVertexes(parent, child, link);
                    } else { // a married child
                        link.toNode.linksConnected.each(l => {
                            if (l.category !== "Marriage" || !l.data) return; // if it has no label node, it's a parent-child link
                            // found the Marriage Link, now get its label Node
                            const mlab = l.labelNodes.first();
                            // parent-child link should connect with the label node,
                            // so the LayoutEdge should connect with the LayoutVertex representing the label node
                            const mlabvert = net.findVertex(mlab);
                            if (mlabvert !== null) {
                                net.linkVertexes(parent, mlabvert, link);
                            }
                        });
                    }
                }
            }

            while (multiSpousePeople.count > 0) {
                // find all collections of people that are indirectly married to each other
                const node = multiSpousePeople.first();
                const cohort = new go.Set();
                this.extendCohort(cohort, node);
                // then encourage them all to be the same generation by connecting them all with a common vertex
                const dummyvert = net.createVertex();
                net.addVertex(dummyvert);
                const marriages = new go.Set();
                cohort.each(n => {
                    n.linksConnected.each(l => {
                        marriages.add(l);
                    })
                });
                marriages.each(link => {
                    // find the vertex for the marriage link (i.e. for the label node)
                    const mlab = link.labelNodes.first()
                    const v = net.findVertex(mlab);
                    if (v !== null) {
                        net.linkVertexes(dummyvert, v, null);
                    }
                });
                // done with these people, now see if there are any other multiple-married people
                multiSpousePeople.removeAll(cohort);
            }
        }

        // collect all of the people indirectly married with a person
        extendCohort(coll, node) {
            if (coll.has(node)) return;
            coll.add(node);
            node.linksConnected.each(l => {
                if (l.category === "Marriage") { // if it's a marriage link, continue with both spouses
                    this.extendCohort(coll, l.fromNode);
                    this.extendCohort(coll, l.toNode);
                }
            });
        }

        assignLayers() {
            super.assignLayers();
            const horiz = this.direction == 0.0 || this.direction == 180.0;
            // for every vertex, record the maximum vertex width or height for the vertex's layer
            const maxsizes = [];
            this.network.vertexes.each(v => {
                const lay = v.layer;
                let max = maxsizes[lay];
                if (max === undefined) max = 0;
                const sz = (horiz ? v.width : v.height);
                if (sz > max) maxsizes[lay] = sz;
            });
            // now make sure every vertex has the maximum width or height according to which layer it is in,
            // and aligned on the left (if horizontal) or the top (if vertical)
            this.network.vertexes.each(v => {
                const lay = v.layer;
                const max = maxsizes[lay];
                if (horiz) {
                    v.focus = new go.Point(0, v.height / 2);
                    v.width = max;
                } else {
                    v.focus = new go.Point(v.width / 2, 0);
                    v.height = max;
                }
            });
            // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
            // (other than the ones that are the widest or tallest in their respective layer).
        }

        initializeIndices() {
            super.initializeIndices();
            const vertical = this.direction === 90 || this.direction === 270;
            this.network.edges.each(e => {
                if (e.fromVertex.node && e.fromVertex.node.isLinkLabel) {
                    e.portFromPos = vertical ? e.fromVertex.focusX : e.fromVertex.focusY;
                }
                if (e.toVertex.node && e.toVertex.node.isLinkLabel) {
                    e.portToPos = vertical ? e.toVertex.focusX : e.toVertex.focusY;
                }
            })
        }

        commitNodes() {
            super.commitNodes();
            // position regular nodes
            this.network.vertexes.each(v => {
                if (v.node !== null && !v.node.isLinkLabel) {
                    v.node.position = new go.Point(v.x, v.y);
                }
            });

            const horiz = this.direction == 0.0 || this.direction == 180.0;
            // position the spouses of each marriage vertex
            this.network.vertexes.each(v => {
                if (v.node === null) return;
                if (!v.node.isLinkLabel) return;
                const labnode = v.node;
                const lablink = labnode.labeledLink;
                // In case the spouses are not actually moved, we need to have the marriage link
                // position the label node, because LayoutVertex.commit() was called above on these vertexes.
                // Alternatively we could override LayoutVetex.commit to be a no-op for label node vertexes.
                lablink.invalidateRoute();
                let spouseA = lablink.fromNode;
                let spouseB = lablink.toNode;
                if (spouseA.opacity > 0 && spouseB.opacity > 0) {
                    // prefer fathers on the left, mothers on the right
                    if (spouseA.category === "F") { // sex is female
                        const temp = spouseA;
                        spouseA = spouseB;
                        spouseB = temp;
                    }
                    // see if the parents are on the desired sides, to avoid a link crossing
                    const aParentsNode = this.findParentsMarriageLabelNode(spouseA);
                    const bParentsNode = this.findParentsMarriageLabelNode(spouseB);
                    if (aParentsNode !== null && bParentsNode !== null &&
                        (horiz ?
                            aParentsNode.position.x > bParentsNode.position.x :
                            aParentsNode.position.y > bParentsNode.position.y)) {
                        // swap the spouses
                        const temp = spouseA;
                        spouseA = spouseB;
                        spouseB = temp;
                    }
                    spouseA.moveTo(v.x, v.y);
                    if (horiz) {
                        spouseB.moveTo(v.x, v.y + spouseA.actualBounds.height + this.spouseSpacing);
                    } else {
                        spouseB.moveTo(v.x + spouseA.actualBounds.width + this.spouseSpacing, v.y);
                    }
                } else if (spouseA.opacity === 0) {
                    const pos = horiz ?
                        new go.Point(v.x, v.centerY - spouseB.actualBounds.height / 2) :
                        new go.Point(v.centerX - spouseB.actualBounds.width / 2, v.y);
                    spouseB.move(pos);
                    if (horiz) pos.y++;
                    else pos.x++;
                    spouseA.move(pos);
                } else if (spouseB.opacity === 0) {
                    const pos = horiz ?
                        new go.Point(v.x, v.centerY - spouseA.actualBounds.height / 2) :
                        new go.Point(v.centerX - spouseA.actualBounds.width / 2, v.y);
                    spouseA.move(pos);
                    if (horiz) pos.y++;
                    else pos.x++;
                    spouseB.move(pos);
                }
                lablink.ensureBounds();
            });
        }

        findParentsMarriageLabelNode(node) {
            const it = node.findNodesInto();
            while (it.next()) {
                const n = it.value;
                if (n.isLinkLabel) return n;
            }
            return null;
        }
    } // end GenogramLayout class


function init() {
    myDiagram = new go.Diagram("myDiagramDiv", {
        "animationManager.isEnabled": false,
        initialAutoScale: go.AutoScale.Uniform,
        "undoManager.isEnabled": true,
        maxSelectionCount: 1,
        // when a node is selected, draw a big yellow circle behind it
        nodeSelectionAdornmentTemplate: new go.Adornment("Auto", {
                layerName: "Grid"
            }) // the predefined layer that is behind everything else
            .add(
                new go.Shape("Circle", {
                    fill: "#c1cee3",
                    stroke: null
                }),
                new go.Placeholder({
                    margin: 2
                })
            ),
        layout: // use a custom layout, defined above
            new GenogramLayout({
            direction: 90,
            layerSpacing: 30,
            columnSpacing: 10
        }),
        ModelChanged: (e) => {
            // just for demonstration purposes,
            if (e.isTransactionFinished) {
                // show the model data in the page's TextArea
                document.getElementById('peopleData').innerHTML = e.model.toJson();
                if (window.Prism) window.Prism.highlightAll();
            }
        }
    });

    const colors = {
        red: '#94251e',
        brown: '#775a4a',
        teal: '#68bfaf',
        orange: '#ca6958',
        cyan: '#23848a',
        green: '#717c42',
        lime: '#cfdf41',
        gray: '#6d7278',
        slate: '#332d31',
        wheat: '#fefaee',
        black: '#233239',
        blue: '#5d8cc1' // used for marriage link only
    }

    // two different node templates, one for each sex,
    // named by the category value in the node data object
    myDiagram.nodeTemplate =
        new go.Node("Vertical", {
            locationSpot: go.Spot.Center,
            locationObjectName: "ICON",
            selectionObjectName: "ICON"
        })
        .bind("opacity", "hide", h => h ? 0 : 1)
        .bind("pickable", "hide", h => !h)
        .add(
            new go.Panel({
                name: "ICON"
            })
            .add(
                new go.Shape({
                    width: 42,
                    height: 42,
                    strokeWidth: 2,
                    fill: 'transparent',
                    stroke: colors.black,
                    portId: ""
                })
                .bind('figure', 's', (s) => s === 'M' ? 'Square' : 'Circle'),
                new go.Panel({ // for each attribute show a Shape at a particular place in the overall square
                    itemTemplate: new go.Panel()
                        .add(
                            new go.Shape({
                                stroke: null,
                                strokeWidth: 0
                            })
                            .bind("fill", "")
                            // .bind("geometry", "", getGeometry)
                        ),
                    margin: 2
                })
                .bind("itemArray", "a")
            ),
            new go.TextBlock({
                textAlign: "center",
                maxSize: new go.Size(80, NaN),
                background: "rgba(255,255,255,0.5)"
            })
            .bind("text", "n")
        );


    // the representation of each label node -- nothing shows on a Marriage Link
    myDiagram.nodeTemplateMap.add(
        "LinkLabel",
        new go.Node({
            selectable: false,
            width: 1,
            height: 1,
            fromEndSegmentLength: 20
        })
    );

    myDiagram.linkTemplate = // for parent-child relationships
        new go.Link({
            routing: go.Routing.Orthogonal,
            corner: 10,
            curviness: 15,
            layerName: "Background",
            selectable: false
        })
        .add(
            new go.Shape({
                stroke: colors.gray,
                strokeWidth: 1.5
            })
        );

    myDiagram.linkTemplateMap.add("Marriage", // for marriage relationships
        new go.Link({ // AvoidsNodes routing might be better when people have multiple marriages
            routing: go.Routing.AvoidsNodes,
            corner: 10,
            fromSpot: go.Spot.LeftRightSides,
            toSpot: go.Spot.LeftRightSides,
            selectable: false,
            isTreeLink: false,
            layerName: "Background"
        })
        .add(
            new go.Shape({
                strokeWidth: 3,
                stroke: colors.blue
            })
        ))


}



// create and initialize the Diagram.model given an array of node data representing people
function setupDiagram(diagram, array, focusId) {
    diagram.model =
        new go.GraphLinksModel({ // declare support for link label nodes
            linkLabelKeysProperty: "labelKeys",
            // this property determines which template is used
            // nodeCategoryProperty: "s",
            // if a node data object is copied, copy its data.a Array
            copiesArrays: true,
            // create all of the nodes for people
            nodeDataArray: array
        });
    setupMarriages(diagram);
    setupParents(diagram);

    const node = diagram.findNodeForKey(focusId);
    if (node !== null) node.isSelected = true;
}

function findMarriage(diagram, a, b) { // A and B are node keys
    const nodeA = diagram.findNodeForKey(a);
    const nodeB = diagram.findNodeForKey(b);
    if (nodeA !== null && nodeB !== null) {
        const it = nodeA.findLinksBetween(nodeB); // in either direction
        while (it.next()) {
            const link = it.value;
            // Link.data.category === "Marriage" means it's a marriage relationship
            if (link.data !== null && link.data.category === "Marriage") return link;
        }
    }
    return null;
}

// now process the node data to determine marriages
function setupMarriages(diagram) {
    const model = diagram.model;
    const nodeDataArray = model.nodeDataArray;
    for (let i = 0; i < nodeDataArray.length; i++) {
        const data = nodeDataArray[i];
        const key = data.key;
        let uxs = data.ux;
        if (uxs !== undefined) {
            if (typeof uxs === "number") uxs = [uxs];
            for (let j = 0; j < uxs.length; j++) {
                const wife = uxs[j];
                const wdata = model.findNodeDataForKey(wife);
                if (key === wife || !wdata) {
                    console.log("cannot create Marriage relationship with self or unknown person " + wife);
                    continue;
                }
                const link = findMarriage(diagram, key, wife);
                if (link === null) {
                    // add a label node for the marriage link
                    const mlab = {
                        category: "LinkLabel"
                    };
                    model.addNodeData(mlab);
                    // add the marriage link itself, also referring to the label node
                    const mdata = {
                        from: key,
                        to: wife,
                        labelKeys: [mlab.key],
                        category: "Marriage"
                    };
                    model.addLinkData(mdata);
                }
            }
        }
        let virs = data.vir;
        if (virs !== undefined) {
            if (typeof virs === "number") virs = [virs];
            for (let j = 0; j < virs.length; j++) {
                const husband = virs[j];
                const hdata = model.findNodeDataForKey(husband);
                if (key === husband || !hdata) {
                    console.log("cannot create Marriage relationship with self or unknown person " + husband);
                    continue;
                }
                const link = findMarriage(diagram, key, husband);
                if (link === null) {
                    // add a label node for the marriage link
                    const mlab = {
                        category: "LinkLabel"
                    };
                    model.addNodeData(mlab);
                    // add the marriage link itself, also referring to the label node
                    const mdata = {
                        from: key,
                        to: husband,
                        labelKeys: [mlab.key],
                        category: "Marriage"
                    };
                    model.addLinkData(mdata);
                }
            }
        }
    }
}

// process parent-child relationships once all marriages are known
function setupParents(diagram) {
    const model = diagram.model;
    const nodeDataArray = model.nodeDataArray;
    for (let i = 0; i < nodeDataArray.length; i++) {
        const data = nodeDataArray[i];
        const key = data.key;
        const mother = data.m;
        const father = data.f;
        if (mother !== undefined && father !== undefined) {
            const link = findMarriage(diagram, mother, father);
            if (link === null) {
                // or warn no known mother or no known father or no known marriage between them
                console.log("unknown marriage: " + mother + " & " + father);
                continue;
            }
            const mdata = link.data;
            if (mdata.labelKeys === undefined || mdata.labelKeys[0] === undefined) continue;
            const mlabkey = mdata.labelKeys[0];
            const cdata = {
                from: mlabkey,
                to: key
            };
            myDiagram.model.addLinkData(cdata);
        }
    }
}

window.addEventListener('DOMContentLoaded', init);


function setup() {

    const name = document.getElementById("name").value
    const layer = document.getElementById("layer").value
    console.log(name, layer)
    fetch('./all_relationship_clean.csv')
        .then(response => response.text())
        .then(csvData => {
            const parsedData = Papa.parse(csvData, {
                header: true, // 將 CSV 的第一行作為鍵名
                skipEmptyLines: true
            });

            let nodes = []; // Array to store nodes
            const nameToPID = {}; // Map to track existing PIDs by name
            const seenEntries = {}; // Map to track seen combinations of self_name, Father, Mother, Spouse
            let nextPID = 1; // Initialize the PID for new nodes

            // Function to create a new node and assign a new PID if needed
            function createNode(name, Father = '', Mother = '', Spouse = '', s = '', a = '') {
                const newNode = {
                    key: nextPID, // Assign a unique PID
                    n: name,
                    f: Father,
                    m: Mother,
                    ux: [Spouse],
                    s: s,
                    pid: a
                };
                console.log('create new node', newNode)
                nodes.push(newNode);
                nameToPID[name] = nextPID; // Store the PID for this name
                nextPID++; // Increment the PID for the next new node
                return newNode.key;
            }

            // Function to check if an entry is a duplicate based on self_name, Father, Mother, and Spouse
            function isDuplicate(entry) {
                const key = `${entry.Father}-${entry.Mother}-${entry.self_name}`;
                const spouseKey = `${entry.Father}-${entry.Mother}-${entry.spouse}`;
                const ID = `${entry.Father}-${entry.Mother}-${entry.PID}`;
                if (seenEntries[key] && !seenEntries[spouseKey]) {
                    // 爸媽自己節點一樣
                    console.log('配偶不同的记录:', key);
                    const existingIndex = nodes.findIndex(node =>
                        node.n === entry.self_name &&
                        (node.f && node.f === nameToPID[entry.Father]) &&
                        (node.m && node.m === nameToPID[entry.Mother])
                    );
                    if (!nameToPID[entry.self_name]) {
                        const SpouseNamePID = createNode(entry.spouse, '', '', nameToPID[entry.self_name], '', '');
                        const existingNode = nodes[existingIndex];
                        existingNode.ux.push(SpouseNamePID);
                        existingNode.key = existingIndex + 1;
                        nodes[existingIndex] = existingNode;
                        nameToPID[entry.self_name] = existingIndex + 1;
                        console.log(nodes)
                        return false;
                    } else {
                        const existingNode = nodes[existingIndex];
                        existingNode.ux.push(nameToPID[entry.spouse]);
                        existingNode.key = existingIndex + 1;
                        nodes[existingIndex] = existingNode;
                        nameToPID[entry.self_name] = existingIndex + 1;
                        console.log(nodes)
                        return false;
                    }
                    // nodes[existingIndex].ux.push(SpouseNamePID);


                } else if (nameToPID[entry.self_name]) {
                    // 名字完全一樣，只是要更新名字節點的資訊
                    console.log('名字相同的紀錄:', entry.self_name);
                    console.log(nameToPID)
                    const existingIndex = nodes.findIndex(node =>
                        node.n === entry.self_name
                    );
                    console.log(existingIndex)
                    console.log(nodes[existingIndex])
                    const existingNode = nodes[existingIndex];
                    if (existingNode) {
                        existingNode.f = nameToPID[entry.Father];
                        existingNode.m = nameToPID[entry.Mother];
                        existingNode.pid = entry.PID;
                        existingNode.ux.push(nameToPID[entry.spouse])
                        nameToPID[entry.self_name] = existingIndex + 1;
                        // delete nameToPID[old_Name];
                        nodes[existingIndex] = existingNode;
                        nameToPID[existingNode.n] = nameToPID[entry.self_name]
                        console.log(nodes[existingIndex])
                    }
                    // 要更新這個刪掉節點的資料
                    if (seenEntries[ID]) {
                        console.log('名字不同的记录:', spouseKey, entry.self_name);
                        const existingIndex = nodes.findIndex(node =>
                            node.f === nameToPID[entry.Father] &&
                            node.m === nameToPID[entry.Mother] &&
                            node.pid.includes(entry.PID) &&
                            node.n != entry.self_name
                        );
                        console.log(nodes[existingIndex])
                        const existingNode = nodes[existingIndex];
                        console.log(existingIndex)
                        if (existingIndex != -1) {
                            // 更新其他节点中的父或母为 existingNode 的节点
                            nodes.forEach(node => {
                                if (node.f === existingNode.key) {
                                    console.log(`更新父节点为新的 self_name: ${entry.self_name}`);
                                    node.f = nameToPID[entry.self_name]; // 更新为新的父节点PID
                                }

                                if (node.m === existingNode.key) {
                                    console.log(`更新母节点为新的 self_name: ${entry.self_name}`);
                                    node.m = nameToPID[entry.self_name]; // 更新为新的母节点PID
                                }
                            });
                            console.log(nameToPID[existingNode.n], nameToPID[entry.self_name])
                            nameToPID[existingNode.n] = nameToPID[entry.self_name]
                        }
                        console.log(nameToPID)


                        nodes = nodes.filter(node =>
                            !(node.f === nameToPID[entry.Father] &&
                                node.m === nameToPID[entry.Mother] &&
                                node.pid.includes(entry.PID) &&
                                node.n !== entry.self_name)
                        );
                        console.log('更新后的节点列表:', nodes);
                        console.log(nameToPID)
                    }


                } else if (seenEntries[spouseKey] || seenEntries[ID]) {
                    // 情况3：父、母、配偶相同，名字不同
                    console.log('名字不同的记录情况3:', spouseKey, entry.self_name);
                    console.log(nameToPID)
                    const existingIndex = nodes.findIndex(node =>
                        node.f === nameToPID[entry.Father] &&
                        node.m === nameToPID[entry.Mother] &&
                        node.pid.includes(entry.PID)
                    );
                    console.log(existingIndex)
                    const existingNode = nodes[existingIndex];
                    if (existingNode) {
                        const old_Name = existingNode.n;
                        existingNode.n = entry.self_name;
                        nameToPID[entry.self_name] = existingIndex + 1;
                        nodes[existingIndex] = existingNode;
                        return false;
                    }

                    return false
                } else {
                    console.log('没有重复的记录');
                    seenEntries[key] = entry.spouse;
                    seenEntries[spouseKey] = entry.self_name;
                    seenEntries[ID] = entry.PID;
                    return false;
                }
            }

            function pr(row) {
                console.log(row)
            }
            // Process each row
            parsedData.data.forEach(row => {
                // Check if the entry is a duplicate
                let selfName = row.self_name.trim();
                let PID = nextPID;
                let PID_key = row.PID;
                let FatherName = row.Father ? row.Father.trim() : '';
                let MotherName = row.Mother ? row.Mother.trim() : '';
                let SpouseName = row.spouse ? row.spouse.trim() : '';
                // 检查是否有重复的记录
                if (isDuplicate(row)) {
                    // 情况1处理逻辑：完全重复，已有的逻辑
                    const existingIndex = nodes.findIndex(node =>
                        node.n === selfName ||
                        (node.f && node.f === nameToPID[FatherName]) ||
                        (node.m && node.m === nameToPID[MotherName])
                    );
                    const existingNode = nodes[existingIndex];
                    const old_Name = existingNode.n;
                    existingNode.n = selfName;
                    const SpouseNamePID = createNode(SpouseName);
                    existingNode.ux.push(SpouseNamePID);
                    existingNode.key = existingIndex + 1;
                    nodes[existingIndex] = existingNode;
                    nameToPID[selfName] = existingIndex + 1;

                    pr(existingIndex);
                    pr(existingNode);
                    pr(nodes);
                    delete nameToPID[old_Name]; // 删除旧的名字在nameToPID中的记录
                    return;
                }
                // 判別資料中是否有父母配偶節點
                // 檢查是否更新節點


                if (FatherName && !nameToPID[FatherName]) {

                    if (MotherName) {
                        if (!nameToPID[MotherName]) {
                            const fatherPID = createNode(FatherName);
                            // 建立媽媽節點
                            createNode(MotherName, '', '', fatherPID, "F", '');
                            const existingIndex = nodes.findIndex(node =>
                                node.n === FatherName
                            );
                            console.log(nodes[existingIndex])
                            const existingNode = nodes[existingIndex];
                            existingNode.ux.push(nameToPID[MotherName])
                        } else {
                            createNode(FatherName, '', '', nameToPID[MotherName], 'M', '');
                        }
                    }
                } else {
                    // 更新節點，已經存在
                    const existingIndex = nodes.findIndex(node =>
                        node.n === FatherName ||
                        node.key === nameToPID[FatherName]
                    );
                    const existingNode = nodes[existingIndex];
                    existingNode.ux.push(nameToPID[MotherName])
                }
                if (MotherName && !nameToPID[MotherName]) {
                    if (FatherName) {
                        if (!nameToPID[FatherName]) {
                            const MotherPID = createNode(MotherName, '', '', '', "F", '');
                            // 建立媽媽節點
                            createNode(FatherName, '', '', MotherPID, "M", '');
                            const existingIndex = nodes.findIndex(node =>
                                node.n === MotherName
                            );
                            console.log(nodes[existingIndex])
                            const existingNode = nodes[existingIndex];
                            existingNode.ux.push(nameToPID[FatherName])
                        } else {
                            createNode(MotherName, '', '', nameToPID[FatherName], 'F', '');
                        }
                    }
                } else {
                    // 更新節點，已經存在
                    const existingIndex = nodes.findIndex(node =>
                        node.n === MotherName ||
                        node.key === nameToPID[MotherName]

                    );
                    const existingNode = nodes[existingIndex];
                    existingNode.ux.push(nameToPID[FatherName])
                }


                if (SpouseName && !nameToPID[SpouseName]) {
                    createNode(SpouseName, '', '', nameToPID[selfName], '', '');
                }
                // Create the node for the current entry, if it doesn't exist already
                if (!nameToPID[selfName]) {
                    const newNode = {
                        n: selfName,
                        f: FatherName ? nameToPID[FatherName] : [],
                        m: MotherName ? nameToPID[MotherName] : [],
                        ux: SpouseName ? nameToPID[SpouseName] : [],
                        s: '',
                        a: PID_key ? PID_key : ''
                    };
                    // 這邊修改PID 
                    createNode(selfName, nameToPID[FatherName], newNode.m, newNode.ux, '', newNode.a);
                }
                // 確認是否更新
                else {
                    // Update existing node if Father or Mother is added later
                    const existingIndex = nodes.findIndex(node => node.n === selfName);
                    const existingNode = nodes[existingIndex];
                    pr(row.PID)
                    pr(existingIndex)
                        // Update father and mother if they exist in the row and aren't already set
                    if (existingIndex != -1) {
                        if (FatherName && !existingNode.f) {
                            existingNode.f = nameToPID[FatherName];
                        }
                        if (MotherName && !existingNode.m) {
                            existingNode.m = nameToPID[MotherName];
                        }
                    }


                    // Update the node in the array
                    nodes[existingIndex] = existingNode;
                }
            });


            function buildFamilyTree(name, maxDegree) {
                const rootPID = nameToPID[name];

                if (!rootPID) {
                    return `未找到 "${name}" 相關節點。`;
                }

                const visited = new Set();
                const familyTree = [];
                const familyTree_node = [];
                const degreeMap = {}; // 儲存每個節點的親等
                let nextDegree = 1;
                let relatedNodes = []
                    // DFS 遍歷函數
                function dfs(pid, degree) {
                    if (visited.has(pid)) return; // 如果節點已拜訪過，跳過

                    visited.add(pid); // 標記為已拜訪
                    degreeMap[pid] = degree; // 記錄節點的親等
                    // 自己
                    if (degree == 0) {
                        relatedNodes = nodes.filter(node =>
                            node.n === targetName
                        );
                    } else {
                        // 找到與該 PID 相關的所有節點
                        relatedNodes = nodes.filter(node =>
                            node.n === targetName ||
                            node.key === pid || // 當前節點
                            node.f === pid || // 父親節點
                            node.m === pid || // 母親節點
                            (node.ux.includes(pid)) // 配偶節點
                        );
                    }

                    relatedNodes.forEach(node => {
                        if (!familyTree_node.includes(node)) {
                            familyTree.push({ node, degree }); // 將節點和親等加入家譜樹
                            familyTree_node.push(node)
                            console.log({ node, degree })
                        }
                        nextDegree = degree + 1; // 確保母親和父親的 degree 相同
                        if (node.m && !visited.has(node.m)) dfs(node.m, nextDegree); // 遍歷母親
                        if (node.f && !visited.has(node.f)) dfs(node.f, nextDegree); // 遍歷父親


                        // 遍歷配偶（如果 ux 是陣列，並且包含有效 PID）
                        if (Array.isArray(node.ux)) {
                            node.ux.forEach(spousePID => {
                                if (!visited.has(spousePID) && spousePID !== "") dfs(spousePID, nextDegree); // 遍歷配偶
                            });
                        }

                    });
                }

                dfs(rootPID, 0); // 從 rootPID 開始 DFS 遍歷，初始親等為 0

                // 過濾出指定親等的節點
                const filteredNodes = familyTree.filter(item => item.degree <= maxDegree);

                return {
                    familyTree: filteredNodes,
                    targetDegree: filteredNodes.map(item => ({
                        name: item.node.self_name,
                        degree: item.degree
                    }))
                };
            }

            // Example usage
            const targetName = name; // 根節點人名
            const maxDegree = layer; // 設定查詢最大親等
            const result = buildFamilyTree(targetName, maxDegree);

            console.log(result.familyTree); // 顯示家譜樹
            console.log(result.targetDegree); // 顯示指定親等的節點及其親等

            // Setup diagram with the family tree
            setupDiagram(myDiagram, result.familyTree.map(item => item.node), 4 /* focus on this person */ );


            // Example usage
            // Setup diagram with the family tree

        })
        .catch(error => console.error('Error:', error));
}