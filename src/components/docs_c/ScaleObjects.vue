<script setup lang="ts">
import { reactive, ref } from "vue"
import * as vNG from "v-network-graph"
import data from "./data"

const configs = reactive(
  vNG.defineConfigs({
    view: {
      scalingObjects: true,
      minZoomLevel: 0.1,
      maxZoomLevel: 16,
    },
  })
)

const zoomLevel = ref(1.5)
</script>

<template>
  <div class="demo-control-panel">
    <el-checkbox v-model="configs.view.scalingObjects">Scaling objects</el-checkbox>
    <el-slider-custom-zoom v-model="zoomLevel" />
  </div>

  <v-network-graph
    v-model:zoom-level="zoomLevel"
    :nodes="data.nodes"
    :edges="data.edges"
    :layouts="data.layouts"
    :configs="configs"
  />
</template>
