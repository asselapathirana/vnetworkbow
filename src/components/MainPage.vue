<script setup lang="ts">
import { reactive, ref } from "vue"
import data from "./data"
import * as vNG from "v-network-graph"
import { TO_DISPLAY_STRING } from "@vue/compiler-core";


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

function addNode(){
    controlNode=false;
    addNode_()
}


function addNode_(loc={x:20,y:20}) {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `N${nextNodeIndex.value}`
  nodes[nodeId] = controlNode? { name: name , selectable: true, draggable: true, size: 15, width: 10, height:30, color: "grey", type:"rect", id:nodeId}:
  { name: name , selectable: true, draggable: true, size: 15, width: 30, height:15, color: "blue", type:"rect", id:nodeId}
  nextNodeIndex.value++
  data.layouts.nodes[nodeId]=loc

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
  var s_=data.layouts.nodes[source]
  var t_=data.layouts.nodes[target]
  var loc={x:0.5*(s_.x+t_.x), y:0.5*(s_.y+t_.y)}
  const mid=addNode_(loc)

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


function showContextMenu(element: HTMLElement, event: MouseEvent) {
  element.style.left = event.x + "px"
  element.style.top = event.y + "px"
  element.style.visibility = "visible"
  const handler = (event: PointerEvent) => {
    if (!event.target || !element.contains(event.target as HTMLElement)) {
      element.style.visibility = "hidden"
      document.removeEventListener("pointerdown", handler, { capture: true })
    }
  }
  document.addEventListener("pointerdown", handler, { passive: true, capture: true })
}

const nodeMenu = ref<HTMLDivElement>()
const menuTargetNode = ref("")
function showNodeContextMenu(params: vNG.NodeEvent<MouseEvent>) {
  const { node, event } = params
  // Disable browser's default context menu
  event.stopPropagation()
  event.preventDefault()
  if (nodeMenu.value) {
    menuTargetNode.value = data.nodes[node].name ?? ""
    showContextMenu(nodeMenu.value, event)
  }
}


const eventHandlers: vNG.EventHandlers = {
  //"view:contextmenu": showViewContextMenu,
  "node:contextmenu": showNodeContextMenu,
  //"edge:contextmenu": showEdgeContextMenu,
}


</script>


<template>
<div class="vh-100">
<div class="container-fluid p-1 bg-primary text-white text-center">
  <h1>V Network Graph</h1>
</div>

<div class="demo-control-panel">
  <el-tabs type="border-card">
    <el-tab-pane label="Structure">
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

  </el-tab-pane>
      <el-tab-pane label="Appearance">

        <div >
      <el-checkbox 
      min="data.configs.view.minZoomLevel"
      max="data.configs.view.maxZoomLevel"
      v-model="data.configs.view.scalingObjects">Scaling objects</el-checkbox>
      <el-slider-custom-zoom v-model="zoomLevel" />
    </div>

        <div class="control">
          <label>Field to show on the label:</label>
          <el-select v-model="data.configs.node.label.text">
            <el-option label="id" value="id" />
            <el-option label="name" value="name" />
            <el-option label="type" value="type" />
          </el-select>
        </div>

        <demo-label-config-panel
          v-model:visible="data.configs.node.label.visible"
          v-model:fontFamily="data.configs.node.label.fontFamily"
          v-model:fontSize="data.configs.node.label.fontSize"
          v-model:lineHeight="data.configs.node.label.lineHeight"
          v-model:color="data.configs.node.label.color"
          v-model:margin="data.configs.node.label.margin"
          v-model:direction="data.configs.node.label.direction"
        />
      </el-tab-pane>
  </el-tabs>
  </div>

<v-network-graph
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    v-model:zoom-level="zoomLevel"
    :nodes="nodes"
    :edges="edges"
    :layouts="data.layouts"
    :configs="data.configs"
    :event-handlers="eventHandlers"
  />

  <div ref="nodeMenu" class="context-menu">
      Menu for the nodes
      <div>{{ menuTargetNode }}</div>
    </div>
</div>

</template>

<style lang="scss" scoped>
.context-menu {
  width: 180px;
  background-color: #efefef;
  padding: 10px;
  position: fixed;
  visibility: hidden;
  font-size: 12px;
  border: 1px solid #aaa;
  box-shadow: 2px 2px 2px #aaa;
  > div {
    border: 1px dashed #aaa;
    padding: 4px;
    margin-top: 8px;
  }
}
</style>