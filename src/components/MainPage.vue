<script setup lang="ts">
import { reactive, ref } from "vue"
import data from "./data"
import * as vNG from "v-network-graph"


const selectedNodes = ref<string[]>([])

const nodes: vNG.Nodes = reactive({ ...data.nodes })
const edges: vNG.Edges = reactive({ ...data.edges })
const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextEdgeIndex = ref(Object.keys(edges).length + 1)

const selectedEdges = ref<string[]>([])
const zoomLevel = ref(5)

var controlNode=false;


function addNode2() {
  controlNode=false;
  //Add downstream node to the selected node and connect it. 
  if (selectedNodes.value.length !== 1) return
  selectedNodes.value.push(addNode_())
  addEdge()
  selectedNodes.value=[]
}

function addNode3() {
  controlNode=false;
  //Add  upstream node to the selected node and connect it. 
  if (selectedNodes.value.length !== 1) return
  const id_ = selectedNodes.value.pop()
  selectedNodes.value.push(addNode_())
  selectedNodes.value.push(id_)
  addEdge()
  selectedNodes.value=[]
}

function addnode(){
    controlNode=false;
    addNode_()
}


function addNode_() {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `N${nextNodeIndex.value}`
  nodes[nodeId] = controlNode? { name: name , selectable: true, draggable: true, size: 15, width: 10, height:30, color: "grey", type:"rect"}:
  { name: name , selectable: true, draggable: true, size: 15, width: 30, height:15, color: "blue", type:"rect"}
  nextNodeIndex.value++

  return nodeId
}

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    if (nodeId != "FIXED"){
      delete nodes[nodeId]
    }
  }
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const edgeId = `edge${nextEdgeIndex.value}`
  edges[edgeId] = { source, target, width:2, color:"black" }
  nextEdgeIndex.value++
}

function addControl() {
  controlNode=true
  if (selectedEdges.value.length != 1) return
  const se=edges[selectedEdges.value[0]]
  const [source, target] = [se.source, se.target]
  removeEdge()
  const mid=addNode_()
  selectedNodes.value=[source,mid]
  addEdge()
  selectedNodes.value=[mid,target]
  addEdge()
  selectedNodes.value=[]

}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    delete edges[edgeId]
  }
}

function canNotDelete(){
  return selectedNodes.value.length==0 ||selectedNodes.value.includes("FIXED") 
}

</script>


<template>
<div class="vh-100">
<div class="container-fluid p-1 bg-primary text-white text-center">
  <h1>V Network Graph</h1>
</div>

<div class="demo-control-panel">
    <div>
      <label>Node:</label>
      <el-button @click="addNode">add</el-button>
      <el-button @click="addNode2" :disabled="selectedNodes.length != 1">add2</el-button>
      <el-button @click="addNode3" :disabled="selectedNodes.length != 1">add3</el-button>
      <el-button :disabled="canNotDelete()" @click="removeNode"
        >remove</el-button
      >
    </div>
    <div>
      <label>Edge:</label>
      <el-button :disabled="selectedNodes.length != 2" @click="addEdge"
        >add</el-button>
      <el-button @click="addControl" :disabled="selectedEdges.length != 1">Add Control</el-button>
    
      <el-button :disabled="selectedEdges.length == 0" @click="removeEdge"
        >remove</el-button
      >
    </div>
    <div >
      <el-checkbox 
      min="data.configs.view.minZoomLevel"
      max="data.configs.view.maxZoomLevel"
      v-model="data.configs.view.scalingObjects">Scaling objects</el-checkbox>
      <el-slider-custom-zoom v-model="zoomLevel" />
    </div>
  </div>

<v-network-graph
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    v-model:zoom-level="zoomLevel"
    :nodes="nodes"
    :edges="edges"
    :layouts="data.layouts"
    :configs="data.configs"
  />
</div>

</template>