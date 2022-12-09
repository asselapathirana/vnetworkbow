<script setup lang="ts">
import { reactive, ref, getCurrentInstance, onMounted, onUnmounted} from "vue"
//import store from "../stores/store.ts"
import { networkStore } from '../stores/store'
import * as vNG from "v-network-graph"
import { TO_DISPLAY_STRING } from "@vue/compiler-core";
import { Download, Upload, Link } from '@element-plus/icons-vue'
import type { UploadInstance } from 'element-plus'

const store = networkStore()


const selectedEdges = ref<string[]>([])
const selectedNodes = ref<string[]>([])


// ref="graph"
const graph = ref<vNG.Instance>()

const fileSelect = ref()
var kind = "empty"

function addEffectNode() {
  controlNode=false;
  causeNode=false;
  //Add downstream node to the selected node and connect it. 
  if (selectedNodes.value.length !== 1) return
  selectedNodes.value.push(addEmptyNode_())
  addEdge()
  selectedNodes.value=[]
}

function addCauseNode() {
  kind="cause"
  //Add  upstream node to the selected node and connect it. 
  if (selectedNodes.value.length !== 1) return
  const id_ = selectedNodes.value.pop()
  selectedNodes.value.push(addEmptyNode_())
  selectedNodes.value.push(id_)
  addEdge()
  selectedNodes.value=[]
}


function addEscalNode() {
  kind="escal"
  //Add  upstream node to the selected node and connect it. 
  if (selectedNodes.value.length !== 1) return
  const id_ = selectedNodes.value.pop()
  selectedNodes.value.push(addEmptyNode_())
  selectedNodes.value.push(id_)
  addEdge()
  selectedNodes.value=[]
}

function addEmptyNode(){
    kind="empty"
    addEmptyNode_()
}

function addEmptyNode_(loc={x:20,y:20}) {
  const nodeId = `N-${store.nextNodeIndex}`
  //console.log("ID: ", nodeId)
  const name = `N-${store.nextNodeIndex} Name`
  store.nodes[nodeId] = { name: name , selectable: true, draggable: true, kind: kind, id:nodeId}
  store.layouts.nodes[nodeId]=loc

  return nodeId
}

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    if (nodeId != "FIXED"){
      delete store.nodes[nodeId]
    }
  }
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const edgeId = `edge${store.nextEdgeIndex}`
  store.edges[edgeId] = { source, target, width:2, color:"black" }
}

function addControlNode() {
  controlNode=true
  if (selectedEdges.value.length != 1) return
  const se=store.edges[selectedEdges.value[0]]
  const [source, target] = [se.source, se.target]
  removeEdge()
  var s_=store.layouts.nodes[source]
  var t_=store.layouts.nodes[target]
  var loc={x:0.5*(s_.x+t_.x), y:0.5*(s_.y+t_.y)}
  const mid=addEmptyNode_(loc)

  selectedNodes.value=[source,mid]
  addEdge()
  selectedNodes.value=[mid,target]
  addEdge()
  selectedNodes.value=[]

}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    delete store.edges[edgeId]
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
    menuTargetNode.value = store.nodes[node] ?? ""
    showContextMenu(nodeMenu.value, event)
  }
}


const eventHandlers: vNG.EventHandlers = {
  //"view:contextmenu": showViewContextMenu,
  "node:contextmenu": showNodeContextMenu,
  //"edge:contextmenu": showEdgeContextMenu,
}




async function downloadAsSvg() {
  if (!graph.value) return
  const text = await graph.value.exportAsSvgText()
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }))//{ type: "octet/stream" }))
  const a = document.createElement("a")
  a.href = url
  a.download = "network-graph.svg" // filename to download
  a.click()
  window.URL.revokeObjectURL(url)
}

async function downloadJSON() {
  const obj=await store.getLocalStorage
  console.log("Text: ", obj)
  const url = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2) // spacing level = 2
                                           ], { type: "octet/stream" }))
  console.log("url:", url)
  const a = document.createElement("a")
  a.href = url
  a.download = "network-graph.json" // filename to download
  a.click()
  window.URL.revokeObjectURL(url)
}

const fileList = ref<UploadUserFile[]>([])




function onKeyPress(event){
  return // temporirily disabled
  console.log("Event", event)
  if (event.key=="Delete" || event.key=="Backspace"){

    for (const nn of selectedNodes.value){
      delete store.nodes[nn]
      console.log("Delete ...", nn)
    }
    for (const ee of selectedEdges.value){
      delete store.edges[ee]
      console.log("Delete ...", ee)
    }
  }
  if (event.key=="Escape"){
    selectedNodes.value=[]
    selectedEdges.value=[]
  }

}

onMounted(() => {
  window.addEventListener('keyup', onKeyPress)
})

onUnmounted(()=>{
  window.removeEventListener('keyup', onKeyPress)

})

function reset(event) {
    //store.setLocalStorage("{}")
    store.readExample()
  }

</script>

<template>
<div class="vh-100">
<div class="container-fluid p-1 bg-primary text-white text-center">
  <div class="row">
        <div class="col"><h1>Bow-Tie Diagram for Risk Analysis</h1></div>
        <div class="col text-right">An Infrastructure Asset Management Tool 
          Assela Pathirana 
    <a href="https://assela.pathirana.net" target="_new"><el-icon color="white"><Link /></el-icon></a>
    <a href="https://www.un-ihe.org/people/staff/assela-pathirana" target="_new"><el-icon color="white"><Link /></el-icon></a></div>
    </div>
  </div>
<div class="demo-control-panel">
  <el-tabs type="border-card">
    <el-tab-pane label="Structure">
    <div>
      <label>Node:</label>
      <el-button @click="addEmptyNode">add</el-button>
      <el-button @click="addEffectNode" :disabled="selectedNodes.length != 1">Effect</el-button>
      <el-button @click="addCauseNode" :disabled="selectedNodes.length != 1">Cause</el-button>
      <el-button @click="addEscalNode" :disabled="selectedNodes.length != 1">Escalation</el-button>
      <el-button @click="addControlNode" :disabled="selectedEdges.length != 1" type="info">Add Control</el-button>
      <el-button :disabled="canNotDelete()" @click="removeNode"
        >remove</el-button
      >
    </div>
    <div>
      <label>Edge:</label>
      <el-button :disabled="selectedNodes.length != 2" @click="addEdge"
        >add</el-button>
      
    
      <el-button :disabled="selectedEdges.length == 0" @click="removeEdge"
        >remove</el-button
      >
    </div>
  </el-tab-pane>
  <el-tab-pane label="File">
      <el-button type="primary" @click="downloadAsSvg">
      <el-icon><download /></el-icon>
      Download SVG
    </el-button>
    <el-button type="primary" @click="downloadJSON">
      <el-icon><download /></el-icon>
      Save
    </el-button>
    <label for="file" class="el-button el-button--primary" >Upload <el-icon><upload /></el-icon></label>
      <input type="file" id="file" ref="fileSelect" class="el-button el-button--primary" @change="store.loadFile" style="display:none" />
    <el-button type="danger" @click="reset">Reset All (Load template) </el-button>
  </el-tab-pane>

    <el-tab-pane label="Appearance">
      <div >
      <el-checkbox 
      v-model="store.configs.view.scalingObjects">Scaling objects</el-checkbox>
      <el-slider-custom-zoom v-model="store.zoomLevel" />
      <el-checkbox 
      v-model="store.snap">Snap to grid (restarts!)</el-checkbox>
    </div>

        <div class="control">
          <label>Field to show on the label:</label>
          <el-select v-model="store.configs.node.label.text">
            <el-option label="id" value="id" />
            <el-option label="name" value="name" />
            <el-option label="kind" value="kind" />
          </el-select>
        </div>

        <demo-label-config-panel
          v-model:visible="store.configs.node.label.visible"
          v-model:fontFamily="store.configs.node.label.fontFamily"
          v-model:fontSize="store.configs.node.label.fontSize"
          v-model:lineHeight="store.configs.node.label.lineHeight"
          v-model:color="store.configs.node.label.color"
          v-model:margin="store.configs.node.label.margin"
          v-model:direction="store.configs.node.label.direction"
        />
  

      </el-tab-pane>
  </el-tabs>
  </div>

<v-network-graph
    ref="graph" 
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    v-model:zoom-level="store.zoomLevel"
    :nodes="store.nodes"
    :edges="store.edges"
    :layouts="store.layouts"
    :configs="store.configs"
    :event-handlers="eventHandlers"
  />

  <div ref="nodeMenu" class="context-menu">
      Edit
      <textarea  v-model="menuTargetNode.name" />
      <label for="type">Kind</label>
    <select name="type" v-model="menuTargetNode.kind">
    <option value="hazard">Hazard</option>
    <option value="cause">Cause</option>
    <option value="effect">Effect</option>
    <option value="control">Control</option>
    <option value="escal">Escalation</option>
    <option value="empty">Empty</option>
    </select>
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