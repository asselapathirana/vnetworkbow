<script setup lang="ts">
import { reactive } from "vue"
import * as vNG from "v-network-graph"
import data from "./data"

const paths: vNG.Paths = {
  path1: {
    edges: ["edge1", "edge3", "edge6", "edge10"],
    zIndex: 2,
    color: "#ff66ffdd",
  },
  path2: {
    edges: ["edge2", "edge4", "edge5", "edge7"],
    zIndex: 1,
    color: "#44cc44dd",
  },
}

const initialConfigs = vNG.defineConfigs({
  node: {
    normal: {
      type: "circle",
      radius: 20,
      color: "#99ccff",
    },
    hover: {
      color: "#88bbff",
    },
    label: {
      visible: false,
      fontSize: 8,
    },
  },
  edge: {
    gap: 12,
    normal: {
      color: "#6699cc",
    },
  },
  path: {
    visible: true,
    curveInNode: false,
    end: "centerOfNode", // "centerOfNode" or "edgeOfNode"
    margin: 0,
    normal: {
      width: 8,
      color: p => p.color,
      dasharray: "",
      linecap: "round",
      linejoin: "round",
      animate: false,
      animationSpeed: 50,
    },
    clickable: true,
    hoverable: true,
    selectable: true,
    zOrder: {
      enabled: true,
      zIndex: n => n.zIndex,
      bringToFrontOnHover: true,
      bringToFrontOnSelected: true,
    },
  },
})
const configs = reactive(initialConfigs)
</script>

<template>
  <div class="demo-control-panel">
    <el-checkbox v-model="configs.path.zOrder.bringToFrontOnHover">
      Bring to front on hover
    </el-checkbox>
    <el-checkbox v-model="configs.path.zOrder.bringToFrontOnSelected">
      Bring to front on selected
    </el-checkbox>
  </div>

  <v-network-graph
    :nodes="data.nodes"
    :edges="data.edges"
    :layouts="data.layouts"
    :paths="paths"
    :configs="configs"
  />
</template>
